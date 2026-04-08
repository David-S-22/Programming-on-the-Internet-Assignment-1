import { format, subMonths } from "date-fns";
import type { expense } from "../../common/types.d.ts";
import type { FastifyBaseLogger, FastifyInstance, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault } from "fastify";
import { expenseSchema, type AppTypeProvider } from "./schemas.ts";

//This type is used to indicate that the passed in instance uses a custom JsonSchemaToTS type resolution provider, which allows for typing and validation to work
type FastifyInstanceWithTypeProvider = FastifyInstance<
  RawServerDefault,
  RawRequestDefaultExpression<RawServerDefault>,
  RawReplyDefaultExpression<RawServerDefault>,
  FastifyBaseLogger,
  AppTypeProvider>;

export default async function registerRoutes(server : FastifyInstanceWithTypeProvider) {
  server.addSchema(expenseSchema)

  server.get("/expenses", {
    //This is the definition of what we're expecting from requests for this route, ensures backend validation and allowing for type resolution
    schema: {
      querystring: {
        type : "object",
        properties: {
          category : { type: "string" },
          period : { type : "integer" }
        },
      }
    },
  },
  //This is the logic that will be executed when sending a request via this route
  async (req, res) => {
    let { category, period } = req.query;
    category = category ?? "";

    //If a value is provided we use that to determine the earliest expense time to get. 
    //Otherwise we get all of the expenses by using `-infinity` as it's a special value that is below all other values in postgres
    const earliestExpenseDate = period != null ? format(subMonths(new Date(), period), "yyyy-MM-dd") : '-infinity';

    const foundExpenses = (await server.pg.query<expense>(`SELECT * FROM expenses.expense 
                                                           WHERE (category = $1 OR '' = $1) AND (date >= $2) 
                                                           ORDER BY id`, [category, earliestExpenseDate])).rows;

    res.status(200);
    res.send(JSON.stringify(foundExpenses));
  });

  server.delete("/expenses/:id", {
    schema: {
      params: {
        type : "object",
        properties : {
          id : { type : "integer" }
        },
        required: ["id"]
      }
    }
  },
  async (req, res) => {
    const { id } = req.params;
    const result = (await server.pg.query("DELETE from expenses.expense WHERE id = $1", [id])).rowCount;

    if (result === 0) {
      res.status(404);
      res.send("Failed to delete expense as it does not exist.");
    }

    res.status(200);
  });

  server.patch("/expenses/:id", {
    schema: {
      params: {
        type : "object",
        properties : {
          id : { type : "integer" }
        },
        required : ["id"],
      },
      body: { $ref : "expenseSchema#" } //This is used to say that the body schema is expenseSchema defined in schemas.ts. The reason why I did this was to reduce unecessary duplication and make maintinability a bit easy since I only have to edit the schema in one location
    }
  },
  async (req, res) => {
    const { id } = req.params;
    const { title, category, amount, cost, date, description } = req.body;
    const result = (await server.pg.query(`UPDATE expenses.expense 
                                           SET title=$1, category=$2, amount=$3, cost=$4, date=$5, description=$6 
                                           WHERE id = $7;`, 
                                             [title, category, amount, cost, date, description, id])).rowCount;

    if (result === 0) {
      res.status(404);
      res.send("Failed to update expense as it does not exist.");
    }

    res.status(200);
  });

  server.post("/expenses/add", {
    schema: {
      body: { $ref : "expenseSchema#" }
    }
  },
  async (req, res) => {
    const { title, category, amount, cost, date, description } = req.body;
    const result = (await server.pg.query<expense>(`INSERT INTO expenses.expense(
                                                    title, category, amount, cost, date, description)
                                                    VALUES ($1, $2, $3, $4, $5, $6)
                                                    RETURNING id;`,
                                                    [title, category, amount, cost, date, description])).rows[0];

    res.status(200);
    res.send(JSON.stringify(result?.id));
  });
}
