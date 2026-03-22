let totalCost = 0;

function getAllExpenses() {
  fetch("http://localhost:3000/expenses")
    .then((data) => {
      data.json()
        .then((expenses) => {
          populateExpenseTable(expenses);
        })
        .catch((e) => console.log(e));
    })
    .catch((e) => console.log(e));
}

function populateExpenseTable(expenses) {
  for (var expense of expenses) {
    const tableBody = document.getElementById("expense-table-body"); //Getting the table body so we can dynamically add table rows based on the data fetched from the db into it
    tableBody.appendChild(createExpenseRow(expense));
    totalCost += expense.cost;
    updateTotalCost();
  }
}

//The purpose of this function is to extract all the data from an expense and create a table row based on the expense
function createExpenseRow(expense) {
  const expenseTitleTableData = document.createElement("td");
  const expenseTitleSpan = document.createElement("span");
  expenseTitleTableData.className = "expense-table-data";
  expenseTitleSpan.innerText = expense.title;
  expenseTitleTableData.appendChild(expenseTitleSpan);

  const expenseCategoryTableData = document.createElement("td");
  expenseCategoryTableData.className = "expense-table-data";
  const expenseCategorySpan = document.createElement("span");
  expenseCategorySpan.innerText = expense.category;
  expenseCategoryTableData.appendChild(expenseCategorySpan);

  const expenseAmountTableData = document.createElement("td");
  expenseAmountTableData.className = "expense-table-data";
  const expenseAmountSpan = document.createElement("span");
  expenseAmountSpan.innerText = expense.amount.toString();
  expenseAmountTableData.appendChild(expenseAmountSpan);

  const expenseCostTableData = document.createElement("td");
  expenseCostTableData.className = "expense-table-data";
  const expenseCostSpan = document.createElement("span");
  expenseCostSpan.innerText = expense.cost.toString();
  expenseCostTableData.appendChild(expenseCostSpan);

  const expenseDateTableData = document.createElement("td");
  expenseDateTableData.className = "expense-table-data";
  const expenseDateSpan = document.createElement("span");
  expenseDateSpan.innerText = new Date(expense.date).toLocaleString();
  expenseDateTableData.appendChild(expenseDateSpan);

  const expenseDescriptionTableData = document.createElement("td");
  expenseDescriptionTableData.className = "expense-table-data";
  const expenseDescriptionSpan = document.createElement("span");
  expenseDescriptionSpan.innerText = expense.description;
  expenseDescriptionTableData.appendChild(expenseDescriptionSpan);


  const editActionButton = document.createElement("button");
  editActionButton.innerText = "🖉"
  editActionButton.className = "expense-table-action-button";
  editActionButton.onclick = () => updateExpense(expense.id);

  const deleteActionButton = document.createElement("button");
  deleteActionButton.innerText = "🗑"
  deleteActionButton.className = "expense-table-action-button";
  deleteActionButton.id = "expense-table-delete-action-button";
  deleteActionButton.onclick = () => deleteExpense(expense.id);

  const expenseActionsSpan = document.createElement("span");
  expenseActionsSpan.append(editActionButton);
  expenseActionsSpan.append(deleteActionButton);
  const expenseActionsTableData = document.createElement("td");
  expenseActionsTableData.className = "expense-table-data";
  expenseActionsTableData.appendChild(expenseActionsSpan);

  const expenseTableRow = document.createElement("tr");
  expenseTableRow.id = `expense-table-row-${expense.id.toString()}`;
  expenseTableRow.appendChild(expenseTitleTableData);
  expenseTableRow.appendChild(expenseCategoryTableData);
  expenseTableRow.appendChild(expenseAmountTableData);
  expenseTableRow.appendChild(expenseCostTableData);
  expenseTableRow.appendChild(expenseDateTableData);
  expenseTableRow.appendChild(expenseDescriptionTableData);
  expenseTableRow.appendChild(expenseActionsTableData);
  return expenseTableRow;
}

function updateExpense(expenseToUpdateId) {
  const rowToUpdate = document.getElementById(`expense-table-row-${expenseToUpdateId}`);
}

function deleteExpense(expenseToRemoveId) {
  const rowToDelete = document.getElementById(`expense-table-row-${expenseToRemoveId}`);
  const expenseTitle = rowToDelete.children[0].textContent;
  const expenseDate = rowToDelete.children[4].textContent;
  const confirmation = confirm(`Are you sure you want to remove the expense with the title "${expenseTitle}" on the date "${expenseDate}"`);

  if (confirmation) {
    const expenseCost = Number(rowToDelete.children[3].textContent);
    fetch(`http://localhost:3000/expenses/${expenseToRemoveId}`, {
      method: "DELETE",
    })
      .then((result) => {
        if (result.status === 200) {
          totalCost -= expenseCost;
          updateTotalCost();
          rowToDelete.remove();
        }
        else {
          alert("An error has occured please try again.");
        }
      })
      .catch((e) => console.log(e));
  }
}

function updateTotalCost() {
    const totalCostParagraph = document.getElementById("total-cost-paragraph");
    totalCostParagraph.textContent = `Total Cost: $${totalCost}`;
}
