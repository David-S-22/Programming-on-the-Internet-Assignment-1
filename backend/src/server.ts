import Fastify from 'fastify'
import fastifypg, { fastifyPostgres } from '@fastify/postgres'
import dotenv from "dotenv";

interface expense { 
  id: number;
  title: string;
  category: string;
  amount: number;
  cost: number;
  date: Date;
  description: string;
};

interface baseIdParamsRequestInterface extends Fastify.RequestGenericInterface {
  Params: {
    id: number
  }
};

interface updateRequestInterface extends baseIdParamsRequestInterface {
  Params: {
    id: number
  },
  Body: expense
};

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

fastify.get("/expenses", async (_, res) => {
  const foundExpenses = (await fastify.pg.query<expense>("select * from expenses.expense")).rows;
  const allExpenses = JSON.stringify(foundExpenses);

  res.header("Access-Control-Allow-Origin", "*");
  res.status(200);
  res.send(allExpenses);
});

fastify.delete<baseIdParamsRequestInterface>("/expenses/:id", async (req, res) => {
  const { id } = req.params;

  res.header("Access-Control-Allow-Origin", "*");
  res.status(200);
});

fastify.patch<updateRequestInterface>("/expenses/update/:id", async (req, res) => {
  const { title, category, amount, cost, date, description } = req.body;

  res.header("Access-Control-Allow-Origin", "*");
  res.status(200);
});

try {
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
