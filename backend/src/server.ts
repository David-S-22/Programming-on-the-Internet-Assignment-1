import Fastify from 'fastify'
import fastifypg from '@fastify/postgres'
import dotenv from "dotenv";
import type { ExpenseCreationRequest, ExpenseUpdateRequest } from './types.js';
import type { expense } from '../../common/types.d.ts';
import requestHandlerContext from './requestHandlers.ts';

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

fastify.register(requestHandlerContext);

fastify.patch<ExpenseUpdateRequest>("/expenses/:id", async (req, res) => {
  const { id } = req.params;
  const { title, category, amount, cost, date, description } = req.body;
  const result = (await fastify.pg.query(`UPDATE expenses.expense 
                                         SET title=$1, category=$2, amount=$3, cost=$4, date=$5, description=$6 
                                         WHERE id = $7;`, 
                                           [title, category, amount, cost, date, description, id]))
                                         .rowCount;
  if (result === 0) {
    res.status(404);
    res.send("Failed to update expense as it does not exist.");
  }

  res.header("Access-Control-Allow-Origin", "*");
  res.status(200);
});

fastify.post<ExpenseCreationRequest>("/expenses/add", async (req, res) => {
  const { title, category, amount, cost, date, description } = req.body;

  const result = (await fastify.pg.query<expense>(`INSERT INTO expenses.expense(
                          title, category, amount, cost, date, description)
                          VALUES ($1, $2, $3, $4, $5, $6)
                          RETURNING id;`,
                            [title, category, amount, cost, date, description])).rows[0];

  res.header("Access-Control-Allow-Origin", "*");
  res.status(200);
  res.send(JSON.stringify(result?.id));
});

try {
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
