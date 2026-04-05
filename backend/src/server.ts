import Fastify from 'fastify'
import fastifypg from '@fastify/postgres'
import dotenv from "dotenv";
import type { ExpenseCreationRequest, ExpenseIdRequest, ExpenseUpdateRequest, ExpenseQueryRequest } from './types.js';
import type { expense } from '../../common/types.js';
import { format, subMonths } from 'date-fns';

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

fastify.get<ExpenseQueryRequest>("/expenses", async (req, res) => {
  let { category, period } = req.query;
  category = category ?? "";

  //If a value is provided we use that to determine the earliest expense time to get. 
  //Otherwise we get all of the expenses by using `-infinity` as it's a special value that is below all other values in postgres
  const earliestExpenseDate = period != null ? format(subMonths(new Date(), period), "yyyy-MM-dd") : '-infinity';

  const foundExpenses = (await fastify.pg.query<expense>(`SELECT * FROM expenses.expense 
                                                         WHERE (category = $1 OR '' = $1) AND (date >= $2)
                                                         ORDER BY id`, [category, earliestExpenseDate])).rows;

  res.header("Access-Control-Allow-Origin", "*");
  res.status(200);
  res.send(JSON.stringify(foundExpenses));
});

fastify.delete<ExpenseIdRequest>("/expenses/:id", async (req, res) => {
  const { id } = req.params;
  const result = (await fastify.pg.query("DELETE from expenses.expense WHERE id = $1", [id])).rowCount;

  if (result === 0) {
    res.status(404);
    res.send("Failed to delete expense as it does not exist.");
  }

  res.header("Access-Control-Allow-Origin", "*");
  res.status(200);
});

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
