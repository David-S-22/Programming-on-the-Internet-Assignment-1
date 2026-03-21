import type { expense } from "../common/types.ts"

function populateExpenseTable() {
  fetch("http://localhost:3000/expenses")
    .then((data) => {
      data.json()
        .then((expenses) => {
          for (var expense of expenses) {
            const tableBody = document.getElementById("expense-table-body"); //Getting the table body so we can dynamically add table rows based on the data fetched from the db into it
            tableBody!.appendChild(createExpenseRow(expense));
          }
        })
        .catch((e) => console.log(e))
    })
    .catch((e) => console.log(e))
}

function createExpenseRow(expense : expense) {
  const expenseTitleTableData = document.createElement("td");
  const expenseTitleSpan = document.createElement("span");
  expenseTitleSpan.className = "expense-table-data";
  expenseTitleSpan.innerText = expense.title;
  expenseTitleTableData.appendChild(expenseTitleSpan);

  const expenseCategoryTableData = document.createElement("td");
  const expenseCategorySpan = document.createElement("span");
  expenseCategorySpan.className = "expense-table-data";
  expenseCategorySpan.innerText = expense.category;
  expenseCategoryTableData.appendChild(expenseCategorySpan);

  const expenseAmountTableData = document.createElement("td");
  const expenseAmountSpan = document.createElement("span");
  expenseAmountSpan.className = "expense-table-data";
  expenseAmountSpan.innerText = expense.amount.toString();
  expenseAmountTableData.appendChild(expenseAmountSpan);

  const expenseCostTableData = document.createElement("td");
  const expenseCostSpan = document.createElement("span");
  expenseCostSpan.className = "expense-table-data";
  expenseCostSpan.innerText = expense.cost.toString();
  expenseCostTableData.appendChild(expenseCostSpan);

  const expenseDateTableData = document.createElement("td");
  const expenseDateSpan = document.createElement("span");
  expenseDateSpan.className = "expense-table-data";
  expenseDateSpan.innerText = expense.date.toString();
  expenseDateTableData.appendChild(expenseDateSpan);

  const expenseDescriptionTableData = document.createElement("td");
  const expenseDescriptionSpan = document.createElement("span");
  expenseDescriptionSpan.className = "expense-table-data";
  expenseDescriptionSpan.innerText = expense.description;
  expenseDescriptionTableData.appendChild(expenseDescriptionSpan);


  const editActionButton = document.createElement("button");
  editActionButton.innerText = "✎"
  editActionButton.className = "expense-table-action-button";
  editActionButton.onclick = () => updateExpense(expense.id);
  const deleteActionButton = document.createElement("button");
  deleteActionButton.innerText = "🗑"
  deleteActionButton.className = "expense-table-action-button";
  deleteActionButton.onclick = () => deleteExpense(expense.id);

  const expenseActionsSpan = document.createElement("span");
  expenseActionsSpan.className = "expense-table-data";
  expenseActionsSpan.append(editActionButton);
  expenseActionsSpan.append(deleteActionButton);
  const expenseActionsTableData = document.createElement("td");
  expenseActionsTableData.appendChild(expenseActionsSpan);

  const expenseTableRow = document.createElement("tr");
  expenseTableRow.id = expense.id.toString();
  expenseTableRow.appendChild(expenseTitleTableData);
  expenseTableRow.appendChild(expenseCategoryTableData);
  expenseTableRow.appendChild(expenseAmountTableData);
  expenseTableRow.appendChild(expenseCostTableData);
  expenseTableRow.appendChild(expenseDateTableData);
  expenseTableRow.appendChild(expenseDescriptionTableData);
  expenseTableRow.appendChild(expenseActionsTableData);
  return expenseTableRow;
}

function updateExpense(expenseToUpdateId : number) {
  console.log(expenseToUpdateId);
}

function deleteExpense(expenseToRemoveId : number) {
  console.log(expenseToRemoveId);
}
