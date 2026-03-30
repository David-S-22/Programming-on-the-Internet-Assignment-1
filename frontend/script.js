var totalCost = 0;

function getAllExpenses() {
  fetch("http://localhost:3000/expenses")
    .then((data) => {
      //Getting the table body here so that we don't have to get it multiple times for the db expense rows and new expense row
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
  const createActionsTableData = () => {
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

    return expenseActionsTableData;
  }

  return createExpenseRow(expense, "span", `expense-table-row-${expense.id.toString()}`, createActionsTableData);
}

function createNewExpenseRow() {
  const createAddExpenseRowActionButton = () => {
    const newExpenseAddButton = document.createElement("button");
    newExpenseAddButton.innerText = "+"
    newExpenseAddButton.onclick = () => addExpense();

    const newExpenseActionsSpan = document.createElement("span");
    newExpenseActionsSpan.append(newExpenseAddButton);
    const newExpenseActionsTableData = document.createElement("td");
    newExpenseActionsTableData.className = "expense-table-data";
    newExpenseActionsTableData.appendChild(newExpenseActionsSpan);

    return newExpenseActionsTableData;
  }
  
  return createExpenseRow(null, "input", "expense-table-row-new", createAddExpenseRowActionButton);
}

function createExpenseRow(expense, elementType, tableRowId, createActionsTableData) {
  const expenseIdentifier = expense != null ? expense.id.toString() : "new";

  const newExpenseTitleTableData = document.createElement("td");
  const newExpenseTitleElement = document.createElement(elementType);
  newExpenseTitleElement.id = `expense-title-${expenseIdentifier}`;
  newExpenseTitleElement.type = "text";
  newExpenseTitleElement.textContent = expense != null ? expense.title : "";
  newExpenseTitleTableData.className = "expense-table-data";
  newExpenseTitleTableData.appendChild(newExpenseTitleElement);

  const newExpenseCategoryTableData = document.createElement("td");
  newExpenseCategoryTableData.className = "expense-table-data";
  const newExpenseCategoryElement = document.createElement(elementType);
  newExpenseCategoryElement.id = `expense-category-${expenseIdentifier}`;
  newExpenseCategoryElement.type = "text";
  newExpenseCategoryElement.textContent = expense != null ? expense.category : "";
  newExpenseCategoryTableData.appendChild(newExpenseCategoryElement);

  const newExpenseAmountTableData = document.createElement("td");
  newExpenseAmountTableData.className = "expense-table-data";
  const newExpenseAmountElement = document.createElement(elementType);
  newExpenseAmountElement.id = `expense-amount-${expenseIdentifier}`;
  newExpenseAmountElement.type = "number";
  newExpenseAmountElement.textContent = expense != null ? expense.amount.toString() : "";
  newExpenseAmountElement.min = "1";
  newExpenseAmountElement.oninput = function() { validity.valid || (value = ''); };
  newExpenseAmountTableData.appendChild(newExpenseAmountElement);

  const newExpenseCostTableData = document.createElement("td");
  newExpenseCostTableData.className = "expense-table-data";
  const newExpenseCostElement = document.createElement(elementType);
  newExpenseCostElement.id = `expense-cost-${expenseIdentifier}`;
  newExpenseCostElement.type = "number";
  newExpenseCostElement.textContent = expense != null ? "$" + expense.cost.toString() : "";
  newExpenseCostElement.min = "1";
  newExpenseCostElement.oninput = function() { validity.valid || (value = ''); };
  newExpenseCostTableData.appendChild(newExpenseCostElement);

  const newExpenseDateTableData = document.createElement("td");
  newExpenseDateTableData.className = "expense-table-data";
  const newExpenseDateElement = document.createElement(elementType);
  newExpenseDateElement.id = `expense-date-${expenseIdentifier}`;
  newExpenseDateElement.type = "date";
  newExpenseDateElement.textContent = expense != null ? new Date(expense.date).toLocaleString([], { year : "numeric", month : "numeric", day : "numeric" }) : "";
  newExpenseDateTableData.appendChild(newExpenseDateElement);

  const newExpenseDescriptionTableData = document.createElement("td");
  newExpenseDescriptionTableData.className = "expense-table-data";
  const newExpenseDescriptionElement = document.createElement(elementType);
  newExpenseDescriptionElement.id = `expense-description-${expenseIdentifier}`;
  newExpenseDescriptionElement.type = "text";
  newExpenseDescriptionElement.textContent = expense != null ? expense.description : "";
  newExpenseDescriptionTableData.appendChild(newExpenseDescriptionElement);

  const newExpenseActionsTableData = createActionsTableData();

  const newExpenseTableRow = document.createElement("tr");
  newExpenseTableRow.id =  tableRowId;
  newExpenseTableRow.appendChild(newExpenseTitleTableData);
  newExpenseTableRow.appendChild(newExpenseCategoryTableData);
  newExpenseTableRow.appendChild(newExpenseAmountTableData);
  newExpenseTableRow.appendChild(newExpenseCostTableData);
  newExpenseTableRow.appendChild(newExpenseDateTableData);
  newExpenseTableRow.appendChild(newExpenseDescriptionTableData);
  newExpenseTableRow.appendChild(newExpenseActionsTableData);
  
  return newExpenseTableRow;
}

function addExpense() {
  const expenseToCreate = getExpenseValuesFromTableRow("new");


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

function validateExpense() {
  if (!expenseToCreate.title || !expenseToCreate.cost || !expenseToCreate.amount || !expenseToCreate.date || !expenseToCreate.description) {
    alert("Please ensure that all values have been provided before trying to add an expense!");
  }
}
