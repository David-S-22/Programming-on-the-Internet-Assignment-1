function populateExpenseTable() {
  fetch("http://localhost:3000/expenses")
    .then((data) => {
      data.json()
      .then((expenses) => {
        for (var expense of expenses) {
          const tableBody = document.getElementById("expense-table-body");
          tableBody.appendChild(createExpenseRow(expense))
        }
      })
      .catch((e) => console.log(e))
    })
    .catch((e) => console.log(e))
}

function createExpenseRow(expense) {
  const expenseTitleElement = document.createElement("th");
  expenseTitleElement.innerText = expense.title;
  const expenseCategoryElement = document.createElement("td");
  expenseCategoryElement.innerText = expense.category;
  const expenseAmountElement = document.createElement("td");
  expenseAmountElement.innerText = expense.amount;
  const expenseCostElement = document.createElement("td");
  expenseCostElement.innerText = expense.cost;
  const expenseDateElement = document.createElement("td");
  expenseDateElement.innerText = expense.date.toString();
  const expenseDescriptionElement = document.createElement("td");
  expenseDescriptionElement.innerText = expense.description;


  const editActionButton = document.createElement("span");
  editActionButton.innerText = "✎"
  const deleteActionButton = document.createElement("span");
  deleteActionButton.innerText = "🗑"
  const expenseActions = document.createElement("td");
  expenseActions.append(editActionButton);
  expenseActions.append(deleteActionButton);

  const expenseTableRow = document.createElement("tr");
  expenseTableRow.appendChild(expenseTitleElement);
  expenseTableRow.appendChild(expenseCategoryElement)
  expenseTableRow.appendChild(expenseAmountElement)
  expenseTableRow.appendChild(expenseCostElement)
  expenseTableRow.appendChild(expenseDateElement)
  expenseTableRow.appendChild(expenseDescriptionElement);
  expenseTableRow.appendChild(expenseActions);
  return expenseTableRow;
}
