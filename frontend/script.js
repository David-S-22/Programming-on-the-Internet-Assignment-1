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

  return createExpenseRow(expense, "READ", `expense-table-row-${expense.id.toString()}`, expenseActionsTableData);
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

  
  return createExpenseRow(null, "WRITE", "expense-table-row-new", newExpenseActionsTableData);
}

// Element type creators
function createSpanElement(elementId, value) {
  const element = document.createElement("span");
  element.id = elementId;
  element.textContent = value || "";
  return element;
}

function createInputElement(elementId, type, value, config = {}) {
  const element = document.createElement("input");
  element.id = elementId;
  element.type = type;
  element.value = value || "";

  if (type === "number") {
    element.min = config.min || "0";
    element.oninput = function() { this.validity.valid || (this.value = ""); };
  }

  return element;
}

function createSelectElement(elementId, options, selectedValue) {
  const element = document.createElement("select");
  element.id = elementId;

  for (const optionValue of options) {
    const option = document.createElement("option");
    option.value = optionValue;
    option.textContent = optionValue;
    element.appendChild(option);
  }

  element.value = selectedValue || (options.length > 0 ? options[0] : "");
  return element;
}

function createExpenseRow(expense, mode, tableRowId, actionsTableDataElement) {
  const expenseIdentifier = expense != null ? expense.id.toString() : "new";
  const isReadMode = mode === "READ";

  // Create Title field (WRITE: input, READ: span)
  const expenseTitleTableData = document.createElement("td");
  expenseTitleTableData.className = "expense-table-data";
  const titleElement = isReadMode
    ? createSpanElement(`expense-title-${expenseIdentifier}`, expense?.title || "")
    : createInputElement(`expense-title-${expenseIdentifier}`, "text", expense?.title || "");
  expenseTitleTableData.appendChild(titleElement);

  // Create Category field (WRITE: select, READ: span)
  const expenseCategoryTableData = document.createElement("td");
  expenseCategoryTableData.className = "expense-table-data";
  const categoryElement = isReadMode
    ? createSpanElement(`expense-category-${expenseIdentifier}`, expense?.category || "")
    : createSelectElement(`expense-category-${expenseIdentifier}`, expenseCategories, expense?.category);
  expenseCategoryTableData.appendChild(categoryElement);

  // Create Amount field (WRITE: number input, READ: span)
  const expenseAmountTableData = document.createElement("td");
  expenseAmountTableData.className = "expense-table-data";
  const amountElement = isReadMode
    ? createSpanElement(`expense-amount-${expenseIdentifier}`, expense?.amount.toString() || "")
    : createInputElement(`expense-amount-${expenseIdentifier}`, "number", expense?.amount.toString() || "", { min: "1" });
  expenseAmountTableData.appendChild(amountElement);

  // Create Cost field (WRITE: number input, READ: span with $ prefix)
  const expenseCostTableData = document.createElement("td");
  expenseCostTableData.className = "expense-table-data";
  const costDisplayValue = isReadMode 
    ? (expense?.cost ? "$" + expense.cost.toString() : "")
    : (expense?.cost?.toString() || "");
  const costElement = isReadMode
    ? createSpanElement(`expense-cost-${expenseIdentifier}`, costDisplayValue)
    : createInputElement(`expense-cost-${expenseIdentifier}`, "number", costDisplayValue, { min: "0" });
  expenseCostTableData.appendChild(costElement);

  // Create Date field (WRITE: date input, READ: span with formatted date)
  const expenseDateTableData = document.createElement("td");
  expenseDateTableData.className = "expense-table-data";
  const dateDisplayValue = expense?.date 
    ? new Date(expense.date).toLocaleString([], { year: "numeric", month: "numeric", day: "numeric" })
    : "";
  const dateElement = isReadMode
    ? createSpanElement(`expense-date-${expenseIdentifier}`, dateDisplayValue)
    : createInputElement(`expense-date-${expenseIdentifier}`, "date", expense?.date || "");
  expenseDateTableData.appendChild(dateElement);

  // Create Description field (WRITE: input, READ: span)
  const expenseDescriptionTableData = document.createElement("td");
  expenseDescriptionTableData.className = "expense-table-data";
  const descriptionElement = isReadMode
    ? createSpanElement(`expense-description-${expenseIdentifier}`, expense?.description || "")
    : createInputElement(`expense-description-${expenseIdentifier}`, "text", expense?.description || "");
  expenseDescriptionTableData.appendChild(descriptionElement);

  // Assemble table row
  const expenseTableRow = document.createElement("tr");
  expenseTableRow.id = tableRowId;
  expenseTableRow.appendChild(expenseTitleTableData);
  expenseTableRow.appendChild(expenseCategoryTableData);
  expenseTableRow.appendChild(expenseAmountTableData);
  expenseTableRow.appendChild(expenseCostTableData);
  expenseTableRow.appendChild(expenseDateTableData);
  expenseTableRow.appendChild(expenseDescriptionTableData);
  expenseTableRow.appendChild(actionsTableDataElement);

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
    const currentElement = addExpenseRow.children[i].children[0];
    if (currentElement.tagName.toLowerCase() === "select") {
      currentElement.value = expenseCategories[0];
    }
    else {
      currentElement.value = ""; //Setting the input to an empty string so the user does not have to clear it
    }
  }
}

function validateExpense(expense) {
  if (!expense.title || expense.category === expenseCategories[0] || !expense.cost || !expense.amount || !expense.date || !expense.description) {
    alert("Please ensure that all values have been provided before trying to add an expense!");
    return false;
  }

  return true;
}
