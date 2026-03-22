import Fastify from 'fastify'
import fastifypg from '@fastify/postgres'
import { getAllExpenses } from './expenses.ts'


interface updateOrDeleteRequest extends Fastify.RequestGenericInterface {
  Params: {
    id: number
  }
}

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

fastify.get("/expenses", async (_, res) => {
  const expenses = await getAllExpenses();
  const allExpenses = JSON.stringify(expenses);
  res.header("Access-Control-Allow-Origin", "*");
  res.status(200);
  res.send(allExpenses);
});

fastify.delete<updateOrDeleteRequest>("/expenses/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);

  res.header("Access-Control-Allow-Origin", "*");
  res.status(200);
})

try {
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
