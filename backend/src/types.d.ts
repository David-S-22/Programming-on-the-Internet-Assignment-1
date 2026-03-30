import type { RequestGenericInterface } from "fastify";

type expense = { 
  id: number;
  title: string;
  category: string;
  amount: number;
  cost: number;
  date: Date;
  description: string;
};

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

export { type expense, ExpenseIdRequest, ExpenseCreationRequest, ExpenseUpdateRequest }
