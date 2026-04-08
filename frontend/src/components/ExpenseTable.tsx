import type { expense } from "../../../common/types";
import { useState, type Dispatch, type SetStateAction } from "react";
import NewExpenseRow from "./NewExpenseRow";
import ExpenseRow from "./ExpenseRow";

type ExpenseTableProps = {
  expenses: expense[]
  defaultExpense: expense
  expenseCategories: string[]
  setExpenses: Dispatch<SetStateAction<expense[]>>
  setErrorMessage: Dispatch<SetStateAction<string>>
  setSystemErrorMessage: (error: Error | string) => void
  filterExpensesUsingCriteria: (expensesToFilter: expense[]) => expense[]
  calculateAndSetTotalCost: (expenses: expense[]) => void
}

export default function ExpenseTable(props : ExpenseTableProps) {
  const [expenseToEdit, setExpenseToEdit] = useState<expense>({ ...props.defaultExpense });

  function IsExpenseInvalid(expenseToCheck : expense) : boolean {
    return expenseToCheck.title === ""
      || expenseToCheck.category === ""
      || expenseToCheck.category === props.expenseCategories[0]
      || !Number.isFinite(expenseToCheck.cost) //Ensures that the number is within an (relatively) appropriate range e.g. not infinity
      || !Number.isInteger(expenseToCheck.amount) //validating to ensure that amount is a whole number
      || expenseToCheck.amount < 1 //There needs to be at least 1 of something otherwise there's no point in recording it
      || expenseToCheck.cost < 0 //As something can technically be free, I set it to 0 so it can be recorded
      || isNaN(expenseToCheck.date.getTime()) //The reason why we check if the gotten time is NaN is because there's no way to my knowledge and research to determine if a date is valid outside of a method like this
      || expenseToCheck.description === "";
  }

  //The reason why this and the update function are both in the table component instead of the individual row function is because I feel that the row should not know about the exepense collection and should only be aware of the individual expense it should represent.
  //Because of this I decided to instead pass these down as props so that we can ensure a seperation of responsibility 
  function DeleteExpense(expenseToDelete : expense) {
    //Confirming the user's actions so they have a chance to go back before they perform this non-reversable action
    const confirmation = confirm(`Are you sure you want to remove the expense with the title "${expenseToDelete.title}" on the date "${new Date(expenseToDelete.date).toLocaleDateString()}"`)

    if (confirmation) {
      fetch(`${import.meta.env.VITE_ROUTE}/expenses/${expenseToDelete.id}`, {
        method: "DELETE",
      })
      .then((result) => {
        if (result.ok) {
          //Creating a new expense array without the deleted expense so we can then re-set the expense array as react state variables are immutable.
          const newExpenses = props.expenses.filter((expense) => expense.id !== expenseToDelete.id);
          props.setExpenses(newExpenses);
          props.calculateAndSetTotalCost(newExpenses);
        }
      })
      .catch((e) => props.setSystemErrorMessage(e));
    }
  }

  function UpdateExpense() {
    //Ensuring that the expense is in a valid state before we try to update it
    if (IsExpenseInvalid(expenseToEdit)) {
      props.setErrorMessage(`The expense you tried to edit is currently invalid. Please ensure all fields are properly filled out before trying again.`);
      return;
    }

    fetch(`${import.meta.env.VITE_ROUTE}/expenses/${expenseToEdit.id}`, {
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
          props.setSystemErrorMessage(`${response.status} ${data}`);
          setExpenseToEdit({ ...props.defaultExpense });
        })
        .catch((e) => props.setSystemErrorMessage(e));
        
        return; //If not valid we exit early to prevent the table from being updated when the DB has not
      }

      //We're replacing the previous expesne with our new one and then setting the state again with our new collection, since states are immutable
      let updatedExpenses = props.expenses.map((expense) => expense.id === expenseToEdit.id ? expenseToEdit : expense);
      updatedExpenses = props.filterExpensesUsingCriteria(updatedExpenses);

      props.setExpenses(updatedExpenses);
      setExpenseToEdit({ ...props.defaultExpense });
      props.calculateAndSetTotalCost(updatedExpenses);
    })
    .catch((e) => props.setSystemErrorMessage(e));
  }

  return (
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
      <tbody>
        { props.expenses.map((expense) => {
          return (
            <ExpenseRow
              key={expense.id}
              expense={expense}
              defaultExpense={props.defaultExpense}
              expenseToEdit={expenseToEdit}
              setExpenseToEdit={setExpenseToEdit}
              isBeingEdited={expense.id === expenseToEdit.id}
              expenseCategories={props.expenseCategories}
              updateExpense={UpdateExpense}
              deleteExpense={DeleteExpense}
            />
          ) 
        })}
        <NewExpenseRow
          expenses={props.expenses}
          defaultExpense={props.defaultExpense}
          expenseCategories={props.expenseCategories}
          setExpenses={props.setExpenses}
          setErrorMessage={props.setErrorMessage}
          setSystemErrorMessage={props.setSystemErrorMessage}
          filterExpensesUsingCriteria={props.filterExpensesUsingCriteria}
          calculateAndSetTotalCost={props.calculateAndSetTotalCost}
          isExpenseInvalid={IsExpenseInvalid}
        />
      </tbody>
    </table>
  )
}
