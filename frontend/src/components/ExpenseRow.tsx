import type { expense } from "../../../common/types";
import type { Dispatch, SetStateAction } from "react";
import EditableExpenseCell from "./EditableExpenseCell";

type ExpenseRowProps = {
  expense: expense
  defaultExpense: expense
  expenseToEdit: expense
  setExpenseToEdit: Dispatch<SetStateAction<expense>>
  isBeingEdited: boolean
  expenseCategories: string[]
  updateExpense: () => void
  deleteExpense: (expenseToDelete: expense) => void
}

export default function ExpenseRow(props : ExpenseRowProps) {
  const expenseDate = new Date(props.expense.date).toLocaleDateString();
  const rowContext = `${props.expense.title} on ${expenseDate}`;
  const isEditing = props.isBeingEdited;

  return (
    <tr>
      <EditableExpenseCell
        isEditing={props.isBeingEdited}
        ariaLabel={`Edit title for ${rowContext}`}
        title="Enter a clear expense title."
        inputType="text"
        inputValue={props.expenseToEdit.title}
        displayValue={props.expense.title}
        onChange={(value) => {
          props.setExpenseToEdit((prev) => ({
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
        inputValue={props.expenseToEdit.category}
        displayValue={props.expense.category}
        options={props.expenseCategories}
        onChange={(value) => {
          props.setExpenseToEdit((prev) => ({
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
        inputValue={props.expenseToEdit.amount}
        displayValue={props.expense.amount}
        decimalScale={0}
        step={1}
        onChange={(value) => {
          props.setExpenseToEdit((prev) => ({
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
        inputValue={props.expenseToEdit.cost}
        displayValue={`$${props.expense.cost}`}
        decimalScale={2}
        step={.01 /* This is to ensure that users can increment by 0.01 without having to type it in */}
        onChange={(value) => {
          props.setExpenseToEdit((prev) => ({
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
        inputValue={props.expenseToEdit.date}
        displayValue={expenseDate}
        onChange={(value) => {
          props.setExpenseToEdit((prev) => ({
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
        inputValue={props.expenseToEdit.description}
        displayValue={props.expense.description}
        onChange={(value) => {
          props.setExpenseToEdit((prev) => ({
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
              <button aria-label={`Confirm edits for ${rowContext}`} onClick={props.updateExpense}>Confirm</button>
              <button aria-label={`Cancel edits for ${rowContext}`} onClick={() => props.setExpenseToEdit({ ...props.defaultExpense })}>Cancel</button>
            </span>
          :
            <span>
              { /* The reason why we set the new Date is because the Date typing gets losed during JSON deSerialization, so we cast it back when we need Date functionality */ }
              <button aria-label={`Edit expense ${rowContext}`} onClick={() => props.setExpenseToEdit({ ...props.expense, date: new Date(props.expense.date) })}>Edit</button>
              <button aria-label={`Delete expense ${rowContext}`} onClick={() => props.deleteExpense(props.expense)}>Delete</button>
            </span>
        }
      </td>
    </tr>
  )
}
