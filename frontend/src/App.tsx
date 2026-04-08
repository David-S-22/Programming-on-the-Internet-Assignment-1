import { useEffect, useState } from 'react'
import './App.css'
import type { expense } from "../../common/types.d.ts"
import ExpenseTable from './components/ExpenseTable.tsx'
import { subMonths } from 'date-fns'
import ExpenseFilters from './components/ExpenseFilters.tsx'
import ErrorMessage from './components/ErrorMessage.tsx'

export default function App() {
  const categoryFilterValues = ["No Category", "Travel", "Groceries", "Personal", "Utilities", "Transport"];
  const categoryFilterKey = "category-filter"

  const periodFilterValues = ["No Period", "3 Months", "6 Months", "9 Months", "12 Months"];
  const periodFilterKey = "period-filter"

  const defaultExpense: expense = {
    id: NaN,
    title: "",
    category: categoryFilterValues[0],
    amount: NaN,
    cost: NaN,
    date: new Date(),
    description: "",
  };

  const [expenses, setExpenses] = useState<expense[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [totalCost, setTotalCost] = useState<number>(0);
  const [categoryFilter, setCategoryFilter] = useState<string>(() => localStorage.getItem(categoryFilterKey) ?? categoryFilterValues[0]);
  const [periodFilter, setPeriodFilter] = useState<string>(() => localStorage.getItem(periodFilterKey) ?? periodFilterValues[0]);

  //This method is used to create the error messages for when the system has come into a problem. As the message for this kind of error should be the same I extracted it out into this helper method to reduce repetition 
  function setSystemErrorMessage(error : Error | string) {
    console.log(error);
    const message = `Page could not be loaded or updated because an error occured, please try again later.`;
    setErrorMessage(message);
  }

  //This method is being used to remove any expenses that do not meet the currently applied filters by removing all the expenses whose category aren't of the current category (if there is one) and have a expense time less than the specified period time (if there is one)
  function FilterExpensesUsingCriteria(expensesToFilter : expense[]) : expense[] {
    return expensesToFilter.filter((expense) => {
      const categoryMatches = categoryFilter === categoryFilterValues[0] || expense.category === categoryFilter;

      if (periodFilter === periodFilterValues[0]) {
        return categoryMatches;
      }

      const monthsToLookBack = Number(periodFilter.match(/\d+/)?.[0]);
      if (!Number.isFinite(monthsToLookBack)) {
        return categoryMatches;
      }

      const cutoffTime = subMonths(new Date(), monthsToLookBack).getTime();
      const expenseTime = new Date(expense.date).getTime();
      const periodMatches = Number.isFinite(expenseTime) && expenseTime >= cutoffTime;

      return categoryMatches && periodMatches;
    });
  }

  //A helper function to help me reduce the need to repeat this logic for updating and adding a expense
  function CalculateAndSetTotalCost(expenses : expense[]) {
    let newTotalCost = 0;
    expenses.forEach((expense) => newTotalCost += expense.cost * expense.amount);
    setTotalCost(newTotalCost);
  }

  //This effect is used to get the filtered expenses based on the selected filters and then populate the expense array with the filtered expenses every time the filters are changed.
  //Also this is used to populate the tables initally as it will run after the inital render, allowing us to initally populate the table.
  useEffect(() => {
    let query = "?";
    if (categoryFilter !== categoryFilterValues[0]) {
      query += `category=${categoryFilter}`;
    }
    if (periodFilter !== periodFilterValues[0]) {
      //The bellow regex is used to extract the number sub-string from the string and then transforming it into a number
      query += `&period=${Number(periodFilter.match(/\d+/))}`;
    }

      localStorage.setItem(categoryFilterKey, categoryFilter);
      localStorage.setItem(periodFilterKey, periodFilter);

    fetch(`${import.meta.env.VITE_ROUTE}/expenses${query}`)
    .then((data) => {
      data.json()
      .then((expenses : expense[]) => {
        setExpenses(expenses);
        CalculateAndSetTotalCost(expenses)
      }).catch((e) => setSystemErrorMessage(e));
    })
    .catch((e) => setSystemErrorMessage(e));

  }, [categoryFilter, periodFilter]);

  return (
    <main className="expense-tracker-page" id="expense-logbook" tabIndex={-1} aria-labelledby="page-title">
      <h1 id="page-title">Welcome to your Expense Tracker</h1>
      <h2 id="logbook-header">Your Expense Logbook</h2>
      {
        <ErrorMessage 
          errorMessage={errorMessage} 
          setErrorMessage={setErrorMessage}
        />
      }
      <ExpenseFilters
        selectedCategoryFilter={categoryFilter}
        selectedPeriodFilter={periodFilter}
        categoryFilterValues={categoryFilterValues}
        periodFilterValues={periodFilterValues}
        setCategoryFilter={setCategoryFilter}
        setPeriodFilter={setPeriodFilter}
      />
      <ExpenseTable
        expenses={expenses}
        defaultExpense={defaultExpense}
        expenseCategories={categoryFilterValues}
        setExpenses={setExpenses}
        setErrorMessage={setErrorMessage}
        setSystemErrorMessage={setSystemErrorMessage}
        filterExpensesUsingCriteria={FilterExpensesUsingCriteria}
        calculateAndSetTotalCost={CalculateAndSetTotalCost}
      />
      <p id="total-cost-paragraph">{`Total Cost: $${totalCost}`}</p>
    </main>
  )
}