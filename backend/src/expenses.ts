export type expense = { 
  id: number;
  title: string;
  category: string;
  amount: number;
  cost: number;
  date: Date;
  description: string;
};

export function getAllExpenses() : Promise<expense[]> {
  var expense1: expense = {id: 1, title: "Computer", category: "Personal", amount: 1, cost: 1300, date: new Date(2026, 3, 15), description: "A new computer for me :)"};
  var expense2: expense ={id: 2, title: "Potatos", category: "Living", amount: 2, cost: 1300, date: new Date(2026, 3, 15), description: "A new computer for me :)"};
  const expenses: expense[] = [expense1, expense2];

  return Promise.resolve(expenses);
}
