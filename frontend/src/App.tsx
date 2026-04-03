import { useEffect, useRef, useState, type ChangeEvent,  } from 'react'
import './App.css'
import type { expense } from "../../common/types"

const expenseCategories = ["Select Category", "Travel", "Groceries", "Personal", "Utilities", "Transport"];

function App() {
const [expenses, setExpenses] = useState<expense[]>([]);
const [expenseToEdit, setExpenseToEdit] = useState<number>(-1);
const newExpense = useRef<expense>({} as expense);
const editedExpense = useRef<expense>({} as expense);

useEffect(() => {
  fetch("http://localhost:3000/expenses")
  .then((data) => {
    data.json()
      .then((expenses: expense[]) => {
        setExpenses(expenses);
      })
      .catch((e) => console.log(e));
  })
  .catch((e) => console.log(e));
}, []);


function DeleteExpense(expenseToDelete : expense) {
  const confirmation = confirm(`Are you sure you want to remove the expense with the title "${expenseToDelete.title}" on the date "${new Date(expenseToDelete.date).toLocaleDateString()}"`)

  if (confirmation) {
    fetch(`http://localhost:3000/expenses/${expenseToDelete.id}`, {
      method: "DELETE",
    })
      .then((result) => {
        if (result.ok) {
          const newExpenses = expenses.filter((expense) => expense.id !== expenseToDelete.id);
          setExpenses(newExpenses);
        }
    })
  }
}

function markExpenseAsBeingEdited(expenseBeingEdited : expense) {
  editedExpense.current = expenseBeingEdited;
  setExpenseToEdit(expenseBeingEdited.id);
}

function addExpense() {
  console.log(newExpense.current);
    // fetch(`http://localhost:3000/expenses/add`, {
    // method: "POST",
    // headers: {
    //   "Content-Type" : "application/json"
    // },
    //   body: JSON.stringify()
    // })
}

function validateInputNumber(event : ChangeEvent<HTMLInputElement, HTMLInputElement>, minNumber : number) {
  const inputToValidate = event.target.value;
  const eventValueAsNumber = Number(inputToValidate);
  if (isNaN(eventValueAsNumber) || eventValueAsNumber < minNumber) {
    //
  }
}

  return (
    <>
      <h1>Welcome to your Expense Tracker</h1>
      <h2 id="logbook-header">Your Expense Logbook</h2>
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
          { expenses.map((expense) => 
            {return (
              <tr key={expense.id}>
                <td className="expense-table-data">
                  {
                    expense.id === expenseToEdit 
                      ? <input /> 
                      : <span>{expense.title}</span>
                  }
                </td>
                <td className="expense-table-data">
                  {
                    expense.id === expenseToEdit 
                      ? <select>
                          { expenseCategories.map((category) => {
                            return (
                              <option>{category}</option>
                            )
                          }) }
                        </select>
                      : <span>{expense.category}</span>
                  }
                </td>
                <td className="expense-table-data">
                  {
                    expense.id === expenseToEdit 
                      ? <input /> 
                      : <span>{expense.amount}</span>
                  }
                </td>
                <td className="expense-table-data">
                  {
                    expense.id === expenseToEdit 
                      ? <input type="number" min="0" />
                      : <span>${expense.cost}</span>
                  }
                </td>
                <td className="expense-table-data">
                  {
                    expense.id === expenseToEdit 
                      ? <input type="number" min="1" />
                      : <span>{new Date(expense.date).toLocaleDateString()}</span>
                  }
                </td>
                <td className="expense-table-data">
                  {
                    expense.id === expenseToEdit 
                      ? <input /> 
                      : <span>{expense.description}</span>
                  }
                </td>
                <td className="expense-table-data">
                  {
                    expense.id === expenseToEdit 
                      ? <span>
                      </span> 
                      : <span>
                        <button onClick={() => markExpenseAsBeingEdited(expense)}>Edit</button>
                        <button onClick={() => DeleteExpense(expense)}>Delete</button>
                      </span>
                  }
                </td>
              </tr>
            )}) 
          }
          <tr id="new">
            <td className="expense-table-data">
              <input onChange={(event) => newExpense.current.title = event.target.value}/>
            </td>
            <td className="expense-table-data">
              <select onChange={(event) => newExpense.current.category = event.target.value}>
                { expenseCategories.map((category) => {
                  return (
                    <option key={category}>{category}</option>
                  )
                }) }
              </select>
            </td>
            <td className="expense-table-data">
              <input type="number" min="0" onChange={(event) => newExpense.current.amount = Number(event.target.value)}/>
            </td>
            <td className="expense-table-data">
              <input type="number" min="0" onChange={(event) => newExpense.current.cost = Number(event.target.value)}/>
            </td>
            <td className="expense-table-data">
              <input type="date" onChange={(event) => newExpense.current.date = new Date(event.target.value)} />
            </td>
            <td className="expense-table-data">
              <input onChange={(event) => newExpense.current.description = event.target.value} />
            </td>
            <td className="expense-table-data">
             <button onClick={addExpense}>Add</button>
            </td>
        </tr>
        </tbody>
      </table>
      <p id="total-cost-paragraph"></p>
    </>
  )
}

export default App
