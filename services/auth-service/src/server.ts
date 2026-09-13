import fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import fjwt from '@fastify/jwt';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const server = fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
  },
});

server.register(cors, {
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  methods: ['GET', 'POST', 'OPTIONS'],
});

server.register(helmet, {
  contentSecurityPolicy: false,
});

server.register(fjwt, {
  secret: process.env.AUTH_SECRET || 'cybertech_isolated_auth_secret_key_32bytes!',
});

// In-memory isolated user datastore
interface UserRecord {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: 'user' | 'editor' | 'admin';
  createdAt: Date;
}

const userStore = new Map<string, UserRecord>();

// Pre-seed default admin
(async () => {
  const adminHash = await bcrypt.hash('AdminPassword123!', 10);
  userStore.set('admin@cybertechcomps.com', {
    id: 'user-admin-01',
    email: 'admin@cybertechcomps.com',
    passwordHash: adminHash,
    name: 'Lead Architect',
    role: 'admin',
    createdAt: new Date(),
  });
})();

// Health Check
server.get('/health', async () => {
  return {
    status: 'healthy',
    service: 'auth-service',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    registeredUsers: userStore.size,
  };
});

// Validation
const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Register
server.post('/api/v1/auth/register', async (request, reply) => {
  const parse = RegisterSchema.safeParse(request.body);
  if (!parse.success) {
    return reply.status(400).send({ success: false, error: 'Validation failed', issues: parse.error.format() });
  }

  const { email, password, name } = parse.data;
  if (userStore.has(email.toLowerCase())) {
    return reply.status(409).send({ success: false, error: 'Email is already registered' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const id = `user-${Date.now()}`;
  const user: UserRecord = {
    id,
    email: email.toLowerCase(),
    passwordHash,
    name,
    role: 'user',
    createdAt: new Date(),
  };

  userStore.set(email.toLowerCase(), user);

  const token = server.jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    { expiresIn: '7d' }
  );

  return reply.status(201).send({
    success: true,
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
});

// Login
server.post('/api/v1/auth/login', async (request, reply) => {
  const parse = LoginSchema.safeParse(request.body);
  if (!parse.success) {
    return reply.status(400).send({ success: false, error: 'Invalid credentials payload' });
  }

  const { email, password } = parse.data;
  const user = userStore.get(email.toLowerCase());

  if (!user) {
    return reply.status(401).send({ success: false, error: 'Invalid email or password' });
  }

  const matches = await bcrypt.compare(password, user.passwordHash);
  if (!matches) {
    return reply.status(401).send({ success: false, error: 'Invalid email or password' });
  }

  const token = server.jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    { expiresIn: '7d' }
  );

  return reply.send({
    success: true,
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
});

// Verify Token (used by Gateway or Client)
server.get('/api/v1/auth/verify', async (request, reply) => {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.status(401).send({ valid: false, error: 'No authorization token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    const decoded = server.jwt.verify(token);

    return reply.send({ valid: true, user: decoded });
  } catch (err: any) {
    return reply.status(401).send({ valid: false, error: 'Invalid or expired token' });
  }
});

// Start Microservice
const PORT = parseInt(process.env.PORT || '4002', 10);
const HOST = process.env.HOST || '0.0.0.0';

server.listen({ port: PORT, host: HOST }, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  console.log(`Auth microservice running at ${address}`);
});
