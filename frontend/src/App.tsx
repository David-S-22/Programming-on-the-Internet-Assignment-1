import { useEffect, useRef, useState, type ChangeEvent,  } from 'react'
import './App.css'
import type { expense } from "../../common/types"

const expenseCategories = ["Select Category", "Travel", "Groceries", "Personal", "Utilities", "Transport"];

function App() {
const [expenses, setExpenses] = useState<expense[]>([]);
const [expenseToEdit, setExpenseToEdit] = useState<number>(-1);
const [errorMessage, setErrorMessage] = useState<string>("");
const newExpense = useRef<expense>({} as expense);
const editedExpense = useRef<expense>({} as expense);

//This effect is used to get all of the expenses currently in the DB and then populate the expense array after the inital render has occured.
useEffect(() => {
  fetch("http://localhost:3000/expenses")
  .then((data) => {
    data.json()
      .then((expenses: expense[]) => {
        setExpenses(expenses);
      })
      .catch((e) => setErrorMessage(e));
  })
  .catch((e) => setErrorMessage(e));
}, []);


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
        setExpenses(newExpenses);
      }
    })
    .catch((e) => setErrorMessage(e));
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

function validateNumberInput(event : React.InputEvent<HTMLInputElement>, propertyToSet: number ) {
  
}

  return (
    <>
      <h1>Welcome to your Expense Tracker</h1>
      { //If an error message has been set we display it otherwise at the top to let the user know that an error has occured
        errorMessage !== "" 
        ? <h2 className='errorMessage'>{`Page could not be loaded or updated because an error occured, please try again later. Error: ${errorMessage}`}</h2> 
        : <></> }
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
                      ? <input type="number" min="0" onInput={(e) => e.currentTarget.validity.valid || (e.currentTarget.value = "")} />
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
                        <button onClick={() => setExpenseToEdit(-1)}>Cancel</button>
                        <button >Confirm</button>
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
