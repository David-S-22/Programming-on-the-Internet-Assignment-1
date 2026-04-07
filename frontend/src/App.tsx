import { useEffect, useState } from 'react'
import './App.css'
import DateInput from './components/DateInput'
import EditableExpenseCell from './components/EditableExpenseCell'
import type { expense } from "../../common/types.d.ts"
import { subMonths } from 'date-fns'
import { XIcon } from 'lucide-react'

const expenseCategories = ["Select Category", "Travel", "Groceries", "Personal", "Utilities", "Transport"];
const periodFilters = ["Select Period", "3 Months", "6 Months", "9 Months", "12 Months"];

const defaultExpense: expense = {
  id: NaN,
  title: "",
  category: expenseCategories[0],
  amount: NaN,
  cost: NaN,
  date: new Date(),
  description: "",
};

function App() {
  const [expenses, setExpenses] = useState<expense[]>([]);
  const [expenseToEdit, setExpenseToEdit] = useState<expense>({ ...defaultExpense });
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [newExpense, setNewExpense] = useState<expense>({ ...defaultExpense });
  const [totalCost, setTotalCost] = useState<number>(0);
  const [categoryFilter, setCategoryFilter] = useState<string>(expenseCategories[0]);
  const [periodFilter, setPeriodFilter] = useState<string>(periodFilters[0]);

  //This method is used to create the error messages for when the system has come into a problem. As the message for this kind of error should be the same I extracted it out into this helper method to reduce repetition 
  function setSystemErrorMessage(error : Error | string) {
    console.log(error);
    const message = `Page could not be loaded or updated because an error occured, please try again later.`;
    setErrorMessage(message);
  }

  function isExpressionInvalid(expenseToCheck : expense) : boolean {
    return expenseToCheck.title === "" 
      || expenseToCheck.category === "" 
      || expenseToCheck.category === expenseCategories[0]
      || isNaN(expenseToCheck.cost) 
      || isNaN(expenseToCheck.amount) 
      || isNaN(expenseToCheck.date.getTime()) //The reason why we check if the gotten time is NaN is because there's no way to my knowledge and research to determine if a date is valid outside of a method like this
      || expenseToCheck.description === "";
  }

  //This method is being used to remove any expenses that do not meet the currently applied filters by firstly ...
  function filterExpensesUsingCriteria(expensesToFilter : expense[]) : expense[] {
    const filteredExpenses = expensesToFilter.filter((expense) => ((categoryFilter === expenseCategories[0] || expense.category === categoryFilter) 
                              && (periodFilter === periodFilters[0] || (subMonths(new Date(), Number(periodFilter.match(/\d+/)))).getTime() <= new Date(expense.date).getTime())));
    return filteredExpenses;
  }

  //This effect is used to get the filtered expenses based on the selected filters and then populate the expense array with the filtered expenses every time the filters are changed.
  //Also this is used to populate the tables initally as it will run after the inital render, allowing us to initally populate the table.
  useEffect(() => {
    let query = "?";
    if (categoryFilter !== expenseCategories[0]) {
      query += `category=${categoryFilter}`;
    }
    if (periodFilter !== periodFilters[0]) {
      //The bellow regex is used to extract the number sub-string from the string
      query += `period=${Number(periodFilter.match(/\d+/))}`;
    }

    fetch(`http://localhost:3000/expenses${query}`)
    .then((data) => {
      data.json()
      .then((expenses : expense[]) => {
        let cost = 0;
        expenses.forEach((expense) => cost += expense.cost * expense.amount);
        setExpenses(expenses);
        setTotalCost(cost);
      })
    })

  }, [categoryFilter, periodFilter]);


  function DeleteExpense(expenseToDelete : expense) {
    //Confirming the user's actions so they have a chance to go back before they perform this non-reversable action
    const confirmation = confirm(`Are you sure you want to remove the expense with the title "${expenseToDelete.title}" on the date "${new Date(expenseToDelete.date).toLocaleDateString()}"`)

    if (confirmation) {
      fetch(`http://localhost:3000/expenses/${expenseToDelete.id}`, {
        method: "DELETE",
      })
      .then((result) => {
        if (result.ok) {
          //Creating a new expense array without the deleted expense so we can then re-set the expense array as react state variables are immutable.
          const newExpenses = expenses.filter((expense) => expense.id !== expenseToDelete.id);
          const newTotalCost = totalCost - expenseToDelete.cost * expenseToDelete.amount;
          setExpenses(newExpenses);
          setTotalCost(newTotalCost);
        }
      })
      .catch((e) => setSystemErrorMessage(e));
    }
  }

  function addExpense() {
    if (isExpressionInvalid(newExpense)) {
      setErrorMessage("The expense you tried to add is incorrect. Please ensure all fields are filled out properly before you try again.");
      return;
    }

    fetch(`http://localhost:3000/expenses/add`, {
      method: "POST",
      headers: {
        "Content-Type" : "application/json"
      },
        body: JSON.stringify(newExpense)
    })
    .then((response) => {
      response.json()
      .then((data : number | string) => {
        if (!response.ok) {
          setErrorMessage(data as string);
          setNewExpense({ ...defaultExpense });
        }
        const newExpenseWithId: expense = { ...newExpense, id: data as number };
        const newExpenses = filterExpensesUsingCriteria([...expenses, newExpenseWithId]); 
        let newTotalCost = 0;
        newExpenses.forEach((expense) => newTotalCost += expense.cost * expense.amount);
        setExpenses(newExpenses);
        setNewExpense({ ...defaultExpense });
        setTotalCost(newTotalCost);
      })
      .catch((e) => setSystemErrorMessage(e))
    })
    .catch((e) => setSystemErrorMessage(e));
  }

  function updateExpense() {
    if (isExpressionInvalid(expenseToEdit)) {
      setErrorMessage(`The expense you tried to edit is currently invalid. Please ensure all fields are properly filled out before trying again.`);
      return;
    }

    fetch(`http://localhost:3000/expenses/${expenseToEdit.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type" : "application/json"
        },
        body: JSON.stringify(expenseToEdit)
      })
      .then((response) => {
        if (!response.ok) {
          response.json()
          .then((data : string) => {
            setSystemErrorMessage(`${response.status} ${data}`);
            setExpenseToEdit({ ...defaultExpense });
          })
          .catch((e) => setSystemErrorMessage(e));
        }

        let updatedExpenses = expenses.map((expense) => expense.id === expenseToEdit.id ? expenseToEdit : expense);
        updatedExpenses = filterExpensesUsingCriteria(updatedExpenses);
        
        let newTotalCost = 0;
        updatedExpenses.forEach((expense) => newTotalCost += expense.cost * expense.amount);
        setExpenses(updatedExpenses);
        setExpenseToEdit({ ...defaultExpense });
        setTotalCost(newTotalCost);
      })
      .catch((e) => setSystemErrorMessage(e));
  }

  return (
    <main className="expense-tracker-page" id="expense-logbook" tabIndex={-1} aria-labelledby="page-title">
      <h1 id="page-title">Welcome to your Expense Tracker</h1>
      { //If an error message has been set we display it otherwise at the top to let the user know that an error has occured
        errorMessage !== "" 
        ? <div className="error-message-banner" role="alert" aria-live="assertive">
            <p id="errorMessage">{errorMessage}</p>
            <button aria-label="Dismiss error message" onClick={() => (setErrorMessage(""))}><XIcon size={16}/></button>
        </div>
        : <></> }
      <h2 id="logbook-header">Your Expense Logbook</h2>
      <div className="criteria-filters" role="group" aria-labelledby="filter-text">
        <p id="filter-text">Filters:</p>
        <select id="category-filter" className="expense-filter-select"
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
          }}
        >
          {expenseCategories.map((category) => {
            return (
              <option key={category}>{category}</option>
            )
          })}
        </select >
        <select id="period-filter" className="expense-filter-select"
          value={periodFilter}
          onChange={(e) => {
            setPeriodFilter(e.target.value)
          }}>
          {periodFilters.map((period) => {
            return (
              <option key={period}>{period}</option>
            )
          })}
        </select>
      </div>
      <table id="expenses-table">
        <thead id="expenses-table-header">
          <tr>
            <th scope="col" className="expense-table-header">Title</th>
            <th scope="col" className="expense-table-header">Category</th>
            <th scope="col" className="expense-table-header">Amount</th>
            <th scope="col" className="expense-table-header">Cost</th>
            <th scope="col" className="expense-table-header">Date</th>
            <th scope="col" className="expense-table-header">Description</th>
            <th scope="col" className="expense-table-header">Actions</th>
          </tr>
        </thead>
        <tbody id="expense-table-body-unique">
          { expenses.map((expense) => {
            const isEditing = expense.id === expenseToEdit.id;
            const expenseDate = new Date(expense.date).toLocaleDateString();
            const rowContext = `${expense.title} on ${expenseDate}`;

            return (
              <tr key={expense.id}>
                <EditableExpenseCell
                  isEditing={isEditing}
                  ariaLabel={`Edit title for ${rowContext}`}
                  inputType="text"
                  value={expenseToEdit.title}
                  displayValue={expense.title}
                  onChange={(value) => {
                    setExpenseToEdit((prev) => ({
                      ...prev,
                      title: value as string,
                    }));
                  }}
                />
                <EditableExpenseCell
                  isEditing={isEditing}
                  ariaLabel={`Edit category for ${rowContext}`}
                  inputType="select"
                  value={expenseToEdit.category}
                  displayValue={expense.category}
                  options={expenseCategories}
                  onChange={(value) => {
                    setExpenseToEdit((prev) => ({
                      ...prev,
                      category: value as string,
                    }));
                  }}
                />
                <EditableExpenseCell
                  isEditing={isEditing}
                  ariaLabel={`Edit amount for ${rowContext}`}
                  inputType="number"
                  min={1}
                  value={expenseToEdit.amount}
                  displayValue={expense.amount}
                  step={1}
                  onChange={(value) => {
                    setExpenseToEdit((prev) => ({
                      ...prev,
                      amount: value as number,
                    }));
                  }}
                />
                <EditableExpenseCell
                  isEditing={isEditing}
                  ariaLabel={`Edit cost for ${rowContext}`}
                  inputType="number"
                  min={0}
                  value={expenseToEdit.cost}
                  displayValue={`$${expense.cost}`}
                  step={0.01}
                  onChange={(value) => {
                    setExpenseToEdit((prev) => ({
                      ...prev,
                      cost: value as number,
                    }));
                  }}
                />
                <EditableExpenseCell
                  isEditing={isEditing}
                  ariaLabel={`Edit date for ${rowContext}`}
                  inputType="date"
                  value={expenseToEdit.date}
                  displayValue={expenseDate}
                  onChange={(value) => {
                    setExpenseToEdit((prev) => ({
                      ...prev,
                      date: value as Date,
                    }));
                  }}
                />
                <EditableExpenseCell
                  isEditing={isEditing}
                  ariaLabel={`Edit description for ${rowContext}`}
                  inputType="text"
                  value={expenseToEdit.description}
                  displayValue={expense.description}
                  onChange={(value) => {
                    setExpenseToEdit((prev) => ({
                      ...prev,
                      description: value as string,
                    }));
                  }}
                />
                <td className="expense-table-data">
                  {
                    isEditing
                      ? 
                      <span>
                        <button aria-label={`Confirm edits for ${rowContext}`} onClick={() => updateExpense()}>Confirm</button>
                        <button aria-label={`Cancel edits for ${rowContext}`} onClick={() => setExpenseToEdit({ ...defaultExpense })}>Cancel</button>
                      </span>
                      : 
                      <span>
                        <button aria-label={`Edit expense ${rowContext}`} onClick={() => setExpenseToEdit({ ...expense, date: new Date(expense.date) })}>Edit</button>
                        <button aria-label={`Delete expense ${rowContext}`} onClick={() => DeleteExpense(expense)}>Delete</button>
                      </span>
                  }
                </td>
              </tr>
            )
          }) }
          { /* This table row is to add the row that allows users to create new expenses */ }
          <tr id="new">
            <td className="expense-table-data">
              <input
                aria-label="New expense title"
                value={newExpense.title}
                onChange={(e) => {
                  setNewExpense((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }));
                }}
              />
            </td>
            <td className="expense-table-data">
              <select
                aria-label="New expense category"
                value={newExpense.category}
                onChange={(e) => {
                  setNewExpense((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }));
                }}
              >
                { expenseCategories.map((category) => {
                  return (
                    <option key={category}>{category}</option>
                  )
                }) }
              </select>
            </td>
            <td className="expense-table-data">
              <input type="number" min="1" 
                aria-label="New expense amount"
                value={newExpense.amount.toString()}
                onInput={(e) => e.currentTarget.validity.valid || (e.currentTarget.value = "")} 
                onChange={(e) => {
                  setNewExpense((prev) => ({
                    ...prev,
                    amount: e.target.valueAsNumber,
                  }));
                }}
              />
            </td>
            <td className="expense-table-data">
              <input type="number" min="0" 
                aria-label="New expense cost"
                value={newExpense.cost.toString()}
                onInput={(e) => e.currentTarget.validity.valid || (e.currentTarget.value = "")} 
                onChange={(e) => {
                  setNewExpense((prev) => ({
                    ...prev,
                    cost: e.target.valueAsNumber,
                  }));
                }}
              />
            </td>
            <td className="expense-table-data">
              <DateInput
                ariaLabel="New expense date"
                value={newExpense.date}
                onChange={(date) => {
                  setNewExpense((prev) => ({
                    ...prev,
                    date,
                  }));
                }}
              />
            </td>
            <td className="expense-table-data">
              <input
                aria-label="New expense description"
                value={newExpense.description}
                onChange={(e) => {
                  setNewExpense((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }));
                }}
              />
            </td>
            <td className="expense-table-data">
             <button aria-label="Add new expense" onClick={addExpense}>Add</button>
            </td>
        </tr>
        </tbody>
      </table>
      <p id="total-cost-paragraph">{`Total Cost: $${totalCost}`}</p>
    </main>
  )
}

export default App
