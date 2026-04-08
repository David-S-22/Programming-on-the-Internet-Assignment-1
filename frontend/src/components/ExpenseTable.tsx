import type { expense } from "../../../common/types";
import EditableExpenseCell from "./EditableExpenseCell";
import { useState, type Dispatch, type SetStateAction } from "react";
import NewExpenseRow from "./NewExpenseRow";

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
      || !Number.isFinite(expenseToCheck.cost)
      || !Number.isInteger(expenseToCheck.amount) //validating to ensure that amount is a whole number
      || expenseToCheck.amount < 1
      || expenseToCheck.cost < 0
      || isNaN(expenseToCheck.date.getTime()) //The reason why we check if the gotten time is NaN is because there's no way to my knowledge and research to determine if a date is valid outside of a method like this
      || expenseToCheck.description === "";
  }


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
        { /* This block of code is adding each expense row into the table so that we can display them all */ }
        { props.expenses.map((expense) => {
          const isEditing = expense.id === expenseToEdit.id;
          const expenseDate = new Date(expense.date).toLocaleDateString();
          const rowContext = `${expense.title} on ${expenseDate}`;

          return (
            <tr key={expense.id}>
              <EditableExpenseCell
                isEditing={isEditing}
                ariaLabel={`Edit title for ${rowContext}`}
                title="Enter a clear expense title."
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
                title="Choose the most accurate category."
                inputType="select"
                value={expenseToEdit.category}
                displayValue={expense.category}
                options={props.expenseCategories}
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
                title="Enter a whole number greater than or equal to 1."
                inputType="number"
                min={1}
                value={expenseToEdit.amount}
                displayValue={expense.amount}
                decimalScale={0}
                step={1}
                onChange={(value) => {
                  setExpenseToEdit((prev) => ({
                    ...prev,
                    amount: value as number, //Because value can be of different types we need to cast it to the expected type
                  }));
                }}
              />
              <EditableExpenseCell
                isEditing={isEditing}
                ariaLabel={`Edit cost for ${rowContext}`}
                title="Use up to 2 decimal places, for example 12.03."
                inputType="number"
                min={0}
                value={expenseToEdit.cost}
                displayValue={`$${expense.cost}`}
                decimalScale={2}
                step={.01 /* This is to ensure that users can increment by 0.01 without having to type it in */}
                onChange={(value) => {
                  setExpenseToEdit((prev) => ({
                    ...prev,
                    cost: value as number, //Because value can be of different types we need to cast it to the expected type
                  }));
                }}
              />
              <EditableExpenseCell
                isEditing={isEditing}
                ariaLabel={`Edit date for ${rowContext}`}
                title="Select the date for this expense."
                inputType="date"
                value={expenseToEdit.date}
                displayValue={expenseDate}
                onChange={(value) => {
                  setExpenseToEdit((prev) => ({
                    ...prev,
                    date: value as Date, //Because value can be of different types we need to cast it to the expected type
                  }));
                }}
              />
              <EditableExpenseCell
                isEditing={isEditing}
                ariaLabel={`Edit description for ${rowContext}`}
                title="Add a short description about this expense."
                inputType="text"
                value={expenseToEdit.description}
                displayValue={expense.description}
                onChange={(value) => {
                  setExpenseToEdit((prev) => ({
                    ...prev,
                    description: value as string, //Because value can be of different types we need to cast it to the expected type

                  }));
                }}
              />
              <td className="expense-table-data">
                {
                  isEditing
                    ?
                    <span>
                      <button aria-label={`Confirm edits for ${rowContext}`} onClick={() => UpdateExpense()}>Confirm</button>
                      <button aria-label={`Cancel edits for ${rowContext}`} onClick={() => setExpenseToEdit({ ...props.defaultExpense })}>Cancel</button>
                    </span>
                    :
                    <span>
                      { /* The reason why we set the new Date is because the Date typing gets losed during JSON deSerialization, so we cast it back when we need Date functionality */ }
                      <button aria-label={`Edit expense ${rowContext}`} onClick={() => setExpenseToEdit({ ...expense, date: new Date(expense.date) })}>Edit</button>
                      <button aria-label={`Delete expense ${rowContext}`} onClick={() => DeleteExpense(expense)}>Delete</button>
                    </span>
                }
              </td>
            </tr>
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