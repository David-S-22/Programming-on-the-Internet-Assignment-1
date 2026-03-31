var totalCost = 0;
const expenseCategories = ["Select Category", "Travel", "Groceries", "Personal", "Utilities", "Transport"];

function getAllExpenses() {
  fetch("http://localhost:3000/expenses")
  .then((data) => {
    //Getting the table body here so that we don't have to get it multiple times
    const tableBody = document.getElementById("expense-table-body");
    data.json()
      .then((expenses) => {
        populateExpenseTable(expenses, tableBody);
        tableBody.appendChild(createNewExpenseRow());
      })
      .catch((e) => console.log(e));
  })
  .catch((e) => console.log(e));
}

function populateExpenseTable(expenses, tableBody) {
  for (var expense of expenses) {
    tableBody.appendChild(createExistingExpenseRow(expense));
    totalCost += expense.cost * expense.amount;
    updateTotalCost();
  }

}

function createExistingExpenseRow(expense) {
  const editActionButton = document.createElement("button");
  editActionButton.innerText = "🖉"
  editActionButton.className = "expense-table-action-button";
  editActionButton.onclick = () => updateExpense(expense.id);

  const deleteActionButton = document.createElement("button");
  deleteActionButton.innerText = "🗑"
  deleteActionButton.className = "expense-table-action-button expense-table-delete-action-button";
  deleteActionButton.onclick = () => deleteExpense(expense.id);

  const expenseActionsSpan = document.createElement("span");
  expenseActionsSpan.append(editActionButton);
  expenseActionsSpan.append(deleteActionButton);
  
  const expenseActionsTableData = document.createElement("td");
  expenseActionsTableData.className = "expense-table-data";
  expenseActionsTableData.appendChild(expenseActionsSpan);

  return createExpenseRow(expense, "span", `expense-table-row-${expense.id.toString()}`, expenseActionsTableData);
}

function createNewExpenseRow() {
  const newExpenseAddButton = document.createElement("button");
  newExpenseAddButton.innerText = "+"
  newExpenseAddButton.onclick = () => addExpense();

  const newExpenseActionsSpan = document.createElement("span");
  newExpenseActionsSpan.append(newExpenseAddButton);
  
  const newExpenseActionsTableData = document.createElement("td");
  newExpenseActionsTableData.className = "expense-table-data";
  newExpenseActionsTableData.appendChild(newExpenseActionsSpan);

  
  return createExpenseRow(null, "input", "expense-table-row-new", newExpenseActionsTableData);
}

function createExpenseRow(expense, elementType, tableRowId, actionsTableDataElement) {
  const expenseIdentifier = expense != null ? expense.id.toString() : "new";
  const categoryElementType = elementType == "span" ? elementType : "select"

  const expenseTitleTableData = document.createElement("td");
  const expenseTitleElement = document.createElement(elementType);
  expenseTitleElement.id = `expense-title-${expenseIdentifier}`;
  expenseTitleElement.type = "text";
  expenseTitleElement.textContent = expense != null ? expense.title : "";
  expenseTitleTableData.className = "expense-table-data";
  expenseTitleTableData.appendChild(expenseTitleElement);

  const expenseCategoryTableData = document.createElement("td");
  expenseCategoryTableData.className = "expense-table-data";
  const expenseCategoryElement = document.createElement(categoryElementType);
  expenseCategoryElement.id = `expense-category-${expenseIdentifier}`;
  expenseCategoryElement.type = "text";

  if (categoryElementType == "select") {
    for (var category of expenseCategories) {
      const categoryOption = document.createElement("option");
      categoryOption.value = category;
      categoryOption.textContent = category;
      expenseCategoryElement.appendChild(categoryOption);
    }

    expenseCategoryElement.value = expense != null ? expense.category : expenseCategories[0];
  }
  else {
    expenseCategoryElement.textContent = expense != null ? expense.category : "";
  }
  expenseCategoryTableData.appendChild(expenseCategoryElement);

  const expenseAmountTableData = document.createElement("td");
  expenseAmountTableData.className = "expense-table-data";
  const expenseAmountElement = document.createElement(elementType);
  expenseAmountElement.id = `expense-amount-${expenseIdentifier}`;
  expenseAmountElement.type = "number";
  expenseAmountElement.textContent = expense != null ? expense.amount.toString() : "";
  expenseAmountElement.min = "1";
  expenseAmountElement.oninput = function() { this.validity.valid || (this.value = ""); };
  expenseAmountTableData.appendChild(expenseAmountElement);

  const expenseCostTableData = document.createElement("td");
  expenseCostTableData.className = "expense-table-data";
  const expenseCostElement = document.createElement(elementType);
  expenseCostElement.id = `expense-cost-${expenseIdentifier}`;
  expenseCostElement.type = "number";
  expenseCostElement.textContent = expense != null ? "$" + expense.cost.toString() : "";
  expenseCostElement.min = "0";
  expenseCostElement.oninput = function() { this.validity.valid || (this.value = ""); };
  expenseCostTableData.appendChild(expenseCostElement);

  const expenseDateTableData = document.createElement("td");
  expenseDateTableData.className = "expense-table-data";
  const expenseDateElement = document.createElement(elementType);
  expenseDateElement.id = `expense-date-${expenseIdentifier}`;
  expenseDateElement.type = "date";
  expenseDateElement.textContent = expense != null ? new Date(expense.date).toLocaleString([], { year : "numeric", month : "numeric", day : "numeric" }) : "";
  expenseDateTableData.appendChild(expenseDateElement);

  const expenseDescriptionTableData = document.createElement("td");
  expenseDescriptionTableData.className = "expense-table-data";
  const expenseDescriptionElement = document.createElement(elementType);
  expenseDescriptionElement.id = `expense-description-${expenseIdentifier}`;
  expenseDescriptionElement.type = "text";
  expenseDescriptionElement.textContent = expense != null ? expense.description : "";
  expenseDescriptionTableData.appendChild(expenseDescriptionElement);

  const expenseActionsTableData = actionsTableDataElement;

  const expenseTableRow = document.createElement("tr");
  expenseTableRow.id =  tableRowId;
  expenseTableRow.appendChild(expenseTitleTableData);
  expenseTableRow.appendChild(expenseCategoryTableData);
  expenseTableRow.appendChild(expenseAmountTableData);
  expenseTableRow.appendChild(expenseCostTableData);
  expenseTableRow.appendChild(expenseDateTableData);
  expenseTableRow.appendChild(expenseDescriptionTableData);
  expenseTableRow.appendChild(expenseActionsTableData);
  
  return expenseTableRow;
}

function addExpense() {
  const expenseToCreate = getExpenseValuesFromTableRow("new");

  if (validateExpense(expenseToCreate)) {
    fetch(`http://localhost:3000/expenses/add`, {
    method: "POST",
    headers: {
      "Content-Type" : "application/json"
    },
    body: JSON.stringify(expenseToCreate)
    })
    .then((response) => {
      if (response.ok) {
        response.json()
        .then((data) => {
          expenseToCreate.id = data.id;
          totalCost += expenseToCreate.cost * expenseToCreate.amount;
          const tableBody = document.getElementById("expense-table-body");
          tableBody.insertBefore(createExistingExpenseRow(expenseToCreate), tableBody.lastElementChild); //Adding the current expense row to the new/create expense so that it looks like the expense has been added
          updateTotalCost();
          clearAddExpenseRowInputs();
        })
        .catch((e) => console.log(e));
      }
    })
    .catch((e) => console.log(e));
  }
}

function updateExpense(expenseToUpdateId) {
  const updatedExpenseValues = getExpenseValuesFromTableRow(document.getElementById(`expense-table-row-${expenseToUpdateId}`), expenseToUpdateId);
  console.log(updatedExpenseValues);
}

function deleteExpense(expenseToRemoveId) {
  const rowToDelete = document.getElementById(`expense-table-row-${expenseToRemoveId}`);
  const expenseTitle = rowToDelete.children[0].textContent;
  const expenseDate = rowToDelete.children[4].textContent;
  const confirmation = confirm(`Are you sure you want to remove the expense with the title "${expenseTitle}" on the date "${expenseDate}"`);

  if (confirmation) {
    const expenseCost = Number(rowToDelete.children[3].textContent.slice(1));
    const expenseAmount = Number(rowToDelete.children[2].textContent);
    fetch(`http://localhost:3000/expenses/${expenseToRemoveId}`, {
      method: "DELETE",
    })
    .then((result) => {
      if (result.ok) {
        rowToDelete.remove();
        totalCost -= expenseCost * expenseAmount;
        updateTotalCost();
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

function getExpenseValuesFromTableRow(expenseId) {
  return {
    title : document.getElementById(`expense-title-${expenseId}`).value,
    category : document.getElementById(`expense-category-${expenseId}`).value,
    amount : document.getElementById(`expense-amount-${expenseId}`).value,
    cost : document.getElementById(`expense-cost-${expenseId}`).value,
    date : document.getElementById(`expense-date-${expenseId}`).value,
    description : document.getElementById(`expense-description-${expenseId}`).value
  };
}

function clearAddExpenseRowInputs() {
  const addExpenseRow = document.getElementById("expense-table-row-new");

  for (var i = 0; i < addExpenseRow.childElementCount - 1; i++) {
    addExpenseRow.children[i].children[0].value = ""; //Setting the input to an empty string so the user does not have to clear it
  }
}

function validateExpense(expense) {
  if (!expense.title || expense.category === expenseCategories[0] || !expense.cost || !expense.amount || !expense.date || !expense.description) {
    alert("Please ensure that all values have been provided before trying to add an expense!");
    return false;
  }

  return true;
}
