import fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import * as dotenv from 'dotenv';

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

// Telemetry store
const viewsMap = new Map<string, number>();
const searchQueries: string[] = [];

// Health Probe
server.get('/health', async () => {
  return {
    status: 'healthy',
    service: 'analytics-service',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    trackedArticles: viewsMap.size,
    searchesLogged: searchQueries.length,
  };
});

// Track view
server.post('/api/v1/analytics/track', async (request, reply) => {
  const { topicSlug, searchQuery } = (request.body || {}) as { topicSlug?: string; searchQuery?: string };

  if (topicSlug) {
    const current = viewsMap.get(topicSlug) || 120;
    viewsMap.set(topicSlug, current + 1);
  }

  if (searchQuery) {
    searchQueries.push(searchQuery.trim().toLowerCase());
    if (searchQueries.length > 500) searchQueries.shift();
  }

  return reply.send({ success: true });
});

// Get stats
server.get('/api/v1/analytics/stats', async () => {
  let totalViews = 0;
  viewsMap.forEach((v) => (totalViews += v));

  return {
    success: true,
    totalViews,
    trackedGuidesCount: viewsMap.size,
    recentSearches: searchQueries.slice(-10),
  };
});

// Start Microservice
const PORT = parseInt(process.env.PORT || '4004', 10);
const HOST = process.env.HOST || '0.0.0.0';

server.listen({ port: PORT, host: HOST }, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  console.log(`Analytics microservice running at ${address}`);
});
