import type { RequestGenericInterface } from "fastify";
import type { expense } from "../../common/types.js"


interface ExpenseIdRequest extends RequestGenericInterface {
  Params: {
    id: number
  }
};

interface ExpenseCreationRequest extends RequestGenericInterface {
  Body: expense 
};

interface ExpenseUpdateRequest extends ExpenseIdRequest {
  Body: expense 
};

export { ExpenseIdRequest, ExpenseCreationRequest, ExpenseUpdateRequest }
