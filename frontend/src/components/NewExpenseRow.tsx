import { useState } from "react";
import DateInput from "./DateInput";
import { NumericFormat } from "react-number-format"
import type { expense } from "../../../common/types";
import type { Dispatch, SetStateAction } from "react";

type NewExpenseRowProps = {
  expenses: expense[]
  defaultExpense: expense
  expenseCategories: string[]
  setExpenses: Dispatch<SetStateAction<expense[]>>
  setErrorMessage: Dispatch<SetStateAction<string>>
  setSystemErrorMessage: (error: Error | string) => void
  filterExpensesUsingCriteria: (expensesToFilter: expense[]) => expense[]
  calculateAndSetTotalCost: (expenses: expense[]) => void
  isExpenseInvalid: (expenseToCheck: expense) => boolean
}

export default function NewExpenseRow(props : NewExpenseRowProps) {
  const [newExpense, setNewExpense] = useState<expense>({ ...props.defaultExpense });

  function AddExpense() {
    //Checking to ensure expense is valid before we even try and add it
    if (props.isExpenseInvalid(newExpense)) {
      props.setErrorMessage("The expense you tried to add is incorrect. Please ensure all fields are filled out properly before you try again.");
      return;
    }

    fetch(`${import.meta.env.VITE_ROUTE}/expenses/add`, {
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
          props.setErrorMessage(data as string);
          setNewExpense({ ...props.defaultExpense });
          return; //If not valid we exit early to prevent the table from being updated when the DB has not
        }
        //Setting the id so that we can use it as the enumeration key and also so that we can delete or modify the newly created expense straight away.
        const newExpenseWithId: expense = { ...newExpense, id: data as number };
        const newExpenses = props.filterExpensesUsingCriteria([...props.expenses, newExpenseWithId]);
        props.setExpenses(newExpenses);
        setNewExpense({ ...props.defaultExpense });
        props.calculateAndSetTotalCost(newExpenses);
      })
      .catch((e) => props.setSystemErrorMessage(e))
    })
    .catch((e) => props.setSystemErrorMessage(e));
  }

  return (
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
          { props.expenseCategories.map((category) => {
            return (
              <option key={category}>{category}</option>
            )
          }) }
        </select>
      </td>
      <td className="expense-table-data">
        <NumericFormat
          key={`new-expense-amount`}
          min="1"
          aria-label="New expense amount"
          value={newExpense.amount.toString()}
          allowNegative={false}
          inputMode="numeric"
          placeholder="e.g. 2"
          decimalScale={0}
          title="Enter a whole number greater than or equal to 1."
          onValueChange={({ floatValue }) => {
            setNewExpense((prev) => ({
              ...prev,
              amount: floatValue ?? NaN,
            }));
          }}
        />
      </td>
      <td className="expense-table-data">
        <NumericFormat
          key={`new-expense-cost`}
          min="0"
          aria-label="New expense cost"
          step={.01}
          value={newExpense.cost.toString()}
          inputMode="decimal"
          decimalScale={2}
          placeholder="e.g. 12.03"
          title="Use up to 2 decimal places, for example 12.03."
          onValueChange={({ floatValue }) => {
            setNewExpense((prev) => ({
              ...prev,
              cost: floatValue ?? NaN,
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
        <button aria-label="Add new expense" onClick={AddExpense}>Add</button>
      </td>
    </tr>
  )
}