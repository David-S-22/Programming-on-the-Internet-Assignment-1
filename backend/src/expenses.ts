export class expense {
  constructor(id: number, title: string, category: string, amount: number, cost: number, date : Date, description: string) {
    this.Id = id;
    this.Title = title;
    this.Category = category;
    this.Amount = amount;
    this.Cost = cost;
    this.Date = date;
    this.Description = description;
  }
  
  Id: number;
  Title: string;
  Category: string;
  Amount: number;
  Cost: number;
  Date: Date;
  Description: string;

  getAllExpenses() : Promise<expense[]> {
      var expense1 = new expense(1, "Computer", "Personal", 1, 1300, new Date(2026, 3, 15), "A new computer for me :)");
      var expense2 = new expense(2, "Potatos", "Living", 2, 1300, new Date(2026, 3, 15), "A new computer for me :)");
      const expenses: expense[] = [expense1, expense2];

      return Promise.resolve(expenses);
  }
}
