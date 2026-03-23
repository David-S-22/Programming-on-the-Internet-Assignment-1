import Fastify from 'fastify'
import fastifypg from '@fastify/postgres'
import fastifyEnv from '@fastify/env';

declare module 'fastify' {
  interface FastifyInstance {
    config: {
    }
  }
}

interface expense { 
  id: number;
  title: string;
  category: string;
  amount: number;
  cost: number;
  date: Date;
  description: string;
};

interface deleteRequest extends Fastify.RequestGenericInterface {
  Params: {
    id: number
  }
};

interface updateRequest extends Fastify.RequestGenericInterface {
  Params: {
    id: number
  },
  Body: expense
};

const fastify = Fastify({
  logger: true
});


fastify.register(fastifyEnv);

fastify.register(fastifypg, {
  host: "localhost",
  port: 5432,
  user: "david",
  password: "test",
  database: "expense tracker"
});

fastify.get("/expenses", async (_, res) => {
  var expense1: expense = {id: 1, title: "Computer", category: "Personal", amount: 1, cost: 1300, date: new Date(2026, 3, 15), description: "A new computer for me :)"};
  var expense2: expense ={id: 2, title: "Potatos", category: "Living", amount: 2, cost: 6, date: new Date(2026, 3, 15), description: "I like potatos!"};
  const expenses: expense[] = [expense1, expense2];
  const allExpenses = JSON.stringify(expenses);

  res.header("Access-Control-Allow-Origin", "*");
  res.status(200);
  res.send(allExpenses);
});

fastify.delete<deleteRequest>("/expenses/:id", async (req, res) => {
  const { id } = req.params;

  res.header("Access-Control-Allow-Origin", "*");
  res.status(200);
});

fastify.put<updateRequest>("/expenses/update/:id", async (req, res) => {
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
