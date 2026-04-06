import type { ExpenseIdRequest, ExpenseQueryRequest } from "./types.d.ts";
import { format, subMonths } from "date-fns";
import type { expense } from "../../common/types.d.ts";
import type { FastifyInstance } from "fastify";
import { fastifyPlugin } from "fastify-plugin"


export default async function requestHandlerContext(server : FastifyInstance) {
  server.get<ExpenseQueryRequest>("/expenses", async (req, res) => {
    let { category, period } = req.query;
    category = category ?? "";

    //If a value is provided we use that to determine the earliest expense time to get. 
    //Otherwise we get all of the expenses by using `-infinity` as it's a special value that is below all other values in postgres
    const earliestExpenseDate = period != null ? format(subMonths(new Date(), period), "yyyy-MM-dd") : '-infinity';

    const foundExpenses = (await server.pg.query<expense>(`SELECT * FROM expenses.expense 
                                                           WHERE (category = $1 OR '' = $1) AND (date >= $2)
                                                           ORDER BY id`, [category, earliestExpenseDate])).rows;

    res.header("Access-Control-Allow-Origin", "*");
    res.status(200);
    res.send(JSON.stringify(foundExpenses));
  });

  server.delete<ExpenseIdRequest>("/expenses/:id", async (req, res) => {
    const { id } = req.params;
    const result = (await server.pg.query("DELETE from expenses.expense WHERE id = $1", [id])).rowCount;

    if (result === 0) {
      res.status(404);
      res.send("Failed to delete expense as it does not exist.");
    }

    res.header("Access-Control-Allow-Origin", "*");
    res.status(200);
  });

  server.register(fastifyPlugin(expenseBodyRequestHandlerContext));

  async function expenseBodyRequestHandlerContext(childServer : FastifyInstance) {
  }
}

