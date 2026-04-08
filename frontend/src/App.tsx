import { useEffect, useState } from 'react'
import './App.css'
import type { expense } from "../../common/types.d.ts"
import ExpenseTable from './components/ExpenseTable.tsx'
import { subMonths } from 'date-fns'
import ExpenseFilters from './components/ExpenseFilters.tsx'
import ErrorMessage from './components/ErrorMessage.tsx'

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

export default function App() {
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
  function filterExpensesUsingCriteria(expensesToFilter : expense[]) : expense[] {
    return expensesToFilter.filter((expense) => {
      //If there's no filters then there's no point in checking them
      if (periodFilter === periodFilterValues[0] && categoryFilter === categoryFilterValues[0]) {
        return true;
      }

      const categoryMatches = expense.category === categoryFilter;

      //If no period filter has been specified there's no point in checking if the expense falls in the specified period.
      if (periodFilter === periodFilterValues[0]) {
        return categoryMatches;
      }

      //Regex is to extract the number of months from the text, as I couldn't find a better way to do this.
      const monthsToLookBack = Number(periodFilter.match(/\d+/)?.[0]);
      const cutoffTime = subMonths(new Date(), monthsToLookBack).getTime();
      const periodMatches = new Date(expense.date).getTime() >= cutoffTime; //Checks if the expense date falls within the cut off time

      //Same as above, if there's no category filter then . Also the reason why we did this check second is because checking the period filter requires more computing compared to a string comparison, so this is a very simple optimisation.
      if (categoryFilter === categoryFilterValues[0]) {
        return periodMatches;
      } 

      return categoryMatches && periodMatches;
    });
  }

  //A helper function to help me reduce the need to repeat this logic for updating and adding a expense
  function calculateAndSetTotalCost(expenses : expense[]) {
    let newTotalCost = 0;
    expenses.forEach((expense) => newTotalCost += expense.cost * expense.amount);
    setTotalCost(newTotalCost);
  }

  //This effect is used to get the filtered expenses based on the selected filters and then populate the expense array with the filtered expenses every time the filters are changed.
  //Also this is used to populate the tables initally as it will run after the inital render, allowing us to initally populate the table.
  useEffect(() => {
    const params = new URLSearchParams();
    if (categoryFilter !== categoryFilterValues[0]) {
      params.append("category", categoryFilter)
    }
    if (periodFilter !== periodFilterValues[0]) {
      //The below regex is used to extract the number sub-string from the string and then transforming it into a number
      //Also since there's only two
      params.append("period", Number(periodFilter.match(/\d+/)).toString())
    }

      //Update the filter values in local storage so that they're up to date with the user's current filter selection
      localStorage.setItem(categoryFilterKey, categoryFilter);
      localStorage.setItem(periodFilterKey, periodFilter);

    fetch(`${import.meta.env.VITE_ROUTE}/expenses?${params}`)
    .then((data) => {
      data.json()
      .then((expenses : expense[]) => {
        setExpenses(expenses);
        calculateAndSetTotalCost(expenses)
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
        filterExpensesUsingCriteria={filterExpensesUsingCriteria}
        calculateAndSetTotalCost={calculateAndSetTotalCost}
      />
      <p id="total-cost-paragraph">{`Total Cost: $${totalCost}`}</p>
    </main>
  )
}
