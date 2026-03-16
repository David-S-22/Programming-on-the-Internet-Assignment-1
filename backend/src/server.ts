import Fastify from 'fastify'
import fastifypg from '@fastify/postgres'
import expense from './expenses.ts'

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
  const expenses = await expense.getAllExpenses();
  const test = JSON.stringify(expenses);
  response.status(200);
  response.header("Access-Control-Allow-Origin", "*");
  response.send({ response: test });
})

try {
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
