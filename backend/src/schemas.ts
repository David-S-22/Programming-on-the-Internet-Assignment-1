import type { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import type { JSONSchema } from "json-schema-to-ts";

const expenseSchema = {
  $id : "expenseSchema",
  type : "object",
  properties : {
    title : { type : "string" },
    category : { type : "string" },
    amount : { type : "integer" },
    cost : { type : "number" },
    date : { type : "string", format : "date-time" },
    description : { type : "string" },
  },
  required : ["title", "category", "amount", "cost", "date", "description"],
  additionalProperties : false,
} as const satisfies JSONSchema;

type AppTypeProvider = JsonSchemaToTsProvider<{
  ValidatorSchemaOptions: {
    references: [typeof expenseSchema]
  },
}>;

export { expenseSchema, type AppTypeProvider }