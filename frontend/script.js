"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function populateExpenseTable() {
    fetch("http://localhost:3000/expenses")
        .then(function (data) {
        data.json()
            .then(function (expenses) {
            for (var _i = 0, expenses_1 = expenses; _i < expenses_1.length; _i++) {
                var expense = expenses_1[_i];
                var tableBody = document.getElementById("expense-table-body"); //Getting the table body so we can dynamically add table rows based on the data fetched from the db into it
                tableBody.appendChild(createExpenseRow(expense));
            }
        })
            .catch(function (e) { return console.log(e); });
    })
        .catch(function (e) { return console.log(e); });
}
function createExpenseRow(expense) {
    var expenseTitleTableData = document.createElement("td");
    var expenseTitleSpan = document.createElement("span");
    expenseTitleSpan.className = "expense-table-data";
    expenseTitleSpan.innerText = expense.title;
    expenseTitleTableData.appendChild(expenseTitleSpan);
    var expenseCategoryTableData = document.createElement("td");
    var expenseCategorySpan = document.createElement("span");
    expenseCategorySpan.className = "expense-table-data";
    expenseCategorySpan.innerText = expense.category;
    expenseCategoryTableData.appendChild(expenseCategorySpan);
    var expenseAmountTableData = document.createElement("td");
    var expenseAmountSpan = document.createElement("span");
    expenseAmountSpan.className = "expense-table-data";
    expenseAmountSpan.innerText = expense.amount.toString();
    expenseAmountTableData.appendChild(expenseAmountSpan);
    var expenseCostTableData = document.createElement("td");
    var expenseCostSpan = document.createElement("span");
    expenseCostSpan.className = "expense-table-data";
    expenseCostSpan.innerText = expense.cost.toString();
    expenseCostTableData.appendChild(expenseCostSpan);
    var expenseDateTableData = document.createElement("td");
    var expenseDateSpan = document.createElement("span");
    expenseDateSpan.className = "expense-table-data";
    expenseDateSpan.innerText = expense.date.toString();
    expenseDateTableData.appendChild(expenseDateSpan);
    var expenseDescriptionTableData = document.createElement("td");
    var expenseDescriptionSpan = document.createElement("span");
    expenseDescriptionSpan.className = "expense-table-data";
    expenseDescriptionSpan.innerText = expense.description;
    expenseDescriptionTableData.appendChild(expenseDescriptionSpan);
    var editActionButton = document.createElement("button");
    editActionButton.innerText = "✎";
    editActionButton.className = "expense-table-action-button";
    editActionButton.onclick = function () { return updateExpense(expense.id); };
    var deleteActionButton = document.createElement("button");
    deleteActionButton.innerText = "🗑";
    deleteActionButton.className = "expense-table-action-button";
    deleteActionButton.onclick = function () { return deleteExpense(expense.id); };
    var expenseActionsSpan = document.createElement("span");
    expenseActionsSpan.className = "expense-table-data";
    expenseActionsSpan.append(editActionButton);
    expenseActionsSpan.append(deleteActionButton);
    var expenseActionsTableData = document.createElement("td");
    expenseActionsTableData.appendChild(expenseActionsSpan);
    var expenseTableRow = document.createElement("tr");
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
function updateExpense(expenseToUpdateId) {
    console.log(expenseToUpdateId);
}
function deleteExpense(expenseToRemoveId) {
}
