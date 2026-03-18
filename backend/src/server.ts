import Fastify from 'fastify'
import fastifypg from '@fastify/postgres'
import { getAllExpenses } from './expenses.ts'

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

fastify.get("/expenses", async (_, response) => {
  const expenses = await getAllExpenses();
  const allExpenses = JSON.stringify(expenses);
  response.header("Access-Control-Allow-Origin", "http:://localhost");
  response.status(200);
  response.send(allExpenses);
})

try {
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
