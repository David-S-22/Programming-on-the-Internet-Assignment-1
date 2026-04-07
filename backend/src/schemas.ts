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
    //This is pretty much used to ensure that the JSON Schema to Type is able to use the expense schema for typing, as otherwise it won't be able to do type resolution as types have no state
    references: [typeof expenseSchema]  
  },
}>;

export { expenseSchema, type AppTypeProvider }