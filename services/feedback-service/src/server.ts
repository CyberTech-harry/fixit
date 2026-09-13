import fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
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

// In-memory datastores
interface VoteRecord {
  topicSlug: string;
  yes: number;
  no: number;
}

interface CommentRecord {
  id: string;
  topicSlug: string;
  authorName: string;
  content: string;
  createdAt: Date;
}

interface TicketRecord {
  id: string;
  email: string;
  details: string;
  category?: string;
  createdAt: Date;
}

const votes = new Map<string, VoteRecord>();
const comments = new Map<string, CommentRecord[]>();
const tickets: TicketRecord[] = [];

// Health Probe
server.get('/health', async () => {
  return {
    status: 'healthy',
    service: 'feedback-service',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    totalTickets: tickets.length,
    trackedTopics: votes.size,
  };
});

// Vote endpoint
const VoteSchema = z.object({
  topicSlug: z.string().min(1),
  voteType: z.enum(['yes', 'no']),
});

server.post('/api/v1/feedback/vote', async (request, reply) => {
  const parse = VoteSchema.safeParse(request.body);
  if (!parse.success) {
    return reply.status(400).send({ success: false, error: 'Invalid vote payload' });
  }

  const { topicSlug, voteType } = parse.data;
  const current = votes.get(topicSlug) || { topicSlug, yes: 45, no: 1 };

  if (voteType === 'yes') current.yes++;
  else current.no++;

  votes.set(topicSlug, current);

  return reply.send({ success: true, helpfulness: current });
});

// Comments
server.get('/api/v1/feedback/comments/:topicSlug', async (request, reply) => {
  const { topicSlug } = request.params as { topicSlug: string };
  const topicComments = comments.get(topicSlug) || [];
  return reply.send({ success: true, comments: topicComments });
});

const PostCommentSchema = z.object({
  authorName: z.string().min(2).max(50),
  content: z.string().min(3).max(500),
});

server.post('/api/v1/feedback/comments/:topicSlug', async (request, reply) => {
  const { topicSlug } = request.params as { topicSlug: string };
  const parse = PostCommentSchema.safeParse(request.body);
  if (!parse.success) {
    return reply.status(400).send({ success: false, error: 'Invalid comment payload' });
  }

  const { authorName, content } = parse.data;
  const comment: CommentRecord = {
    id: `cmt-${Date.now()}`,
    topicSlug,
    authorName,
    content,
    createdAt: new Date(),
  };

  const list = comments.get(topicSlug) || [];
  list.unshift(comment);
  comments.set(topicSlug, list);

  return reply.status(201).send({ success: true, comment });
});

// Support Ticket Submission
const TicketSchema = z.object({
  email: z.string().email(),
  details: z.string().min(10).max(1000),
  category: z.string().optional(),
});

server.post('/api/v1/feedback/tickets', async (request, reply) => {
  const parse = TicketSchema.safeParse(request.body);
  if (!parse.success) {
    return reply.status(400).send({ success: false, error: 'Validation failed' });
  }

  const ticket: TicketRecord = {
    id: `tkt-${Date.now()}`,
    email: parse.data.email,
    details: parse.data.details,
    category: parse.data.category,
    createdAt: new Date(),
  };

  tickets.push(ticket);
  server.log.info(`New support ticket logged: ${ticket.id} from ${ticket.email}`);

  return reply.status(201).send({
    success: true,
    message: 'Diagnostic request logged. Our technicians will inspect.',
    ticketId: ticket.id,
  });
});

// Start Microservice
const PORT = parseInt(process.env.PORT || '4003', 10);
const HOST = process.env.HOST || '0.0.0.0';

server.listen({ port: PORT, host: HOST }, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  console.log(`Feedback microservice running at ${address}`);
});
