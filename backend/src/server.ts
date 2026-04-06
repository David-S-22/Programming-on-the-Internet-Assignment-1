import Fastify from 'fastify'
import fastifypg from '@fastify/postgres'
import dotenv from "dotenv";
import registerRoutes from './routes.ts';

dotenv.config({ path: "./.env", override: true });

const fastify = Fastify({
  logger: true
});

fastify.register(fastifypg, {
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE
});

fastify.register(registerRoutes);

try {
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
