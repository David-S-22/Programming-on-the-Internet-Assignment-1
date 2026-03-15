import Fastify from 'fastify'
import fastifypg from '@fastify/postgres'

const fastify = Fastify({
  logger: true
});

fastify.register(fastifypg, {
  host: "localhost",
  port: 5432,
  user: "david",
  password: "test",
  database: "expense tracker"
});

fastify.post

fastify.get("/", (_, reply) => {
  reply.send({value1 : "test"});
})

try {
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
