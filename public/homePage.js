const logout = new LogoutButton();
logout.action = exit => ApiConnector.logout(response => {
    if (response.success) {
        location.reload();
    }
});

ApiConnector.current(current => {
    if (current.success) {
        ProfileWidget.showProfile(current.data);
    }
});

const spreadsheet = new RatesBoard();
function ratesUpdate() {
    ApiConnector.getStocks(response => {
        if (response.success) {
           spreadsheet.clearTable();
           spreadsheet.fillTable(response.data);
        }
    });
}

ratesUpdate();
setInterval(ratesUpdate, 60000);

const addMoneyForm = new MoneyManager();
addMoneyForm.addMoneyCallback = receipts => ApiConnector.addMoney(receipts, response => {
    if (response.success) {
       ProfileWidget.showProfile(response.data);
       addMoneyForm.setMessage(true, 'Успешное пополнение счета на' + receipts.currency + receipts.amount);;
    }
    addMoneyForm.setMessage(false, 'Ошибка: ' + response.error);
});

addMoneyForm.conversionMoneyCallback = exchange => ApiConnector.convertMoney(exchange, response => {
    if (response.success) {
       ProfileWidget.showProfile(response.data);
       addMoneyForm.setMessage(true, 'Успешная конвертация суммы ' + exchange.fromCurrency + exchange.fromAmount);
    }
    addMoneyForm.setMessage(false, 'Ошибка: ' + response.error);
});

addMoneyForm.sendMoneyCallback = transfer => ApiConnector.transferMoney(transfer, response => {
    if (response.success) {
       ProfileWidget.showProfile(response.data);
       addMoneyForm.setMessage(true, 'Успешный перевод ' + transfer.currency + transfer.amount + ' получателю ' + transfer.to);
    }
    addMoneyForm.setMessage(false, 'Ошибка: ' + response.error);
});

const favoriteSpreadsheet = new FavoritesWidget();
ApiConnector.getFavorites(response => {
    if (response.success) {
       favoriteSpreadsheet.clearTable();
       favoriteSpreadsheet.fillTable(response.data);
       addMoneyForm.updateUsersList(response.data);
    }
 });

 favoriteSpreadsheet.addUserCallback = addUser => ApiConnector.addUserToFavorites(addUser, response => {
    if (response.success) {
       favoriteSpreadsheet.clearTable();
       favoriteSpreadsheet.fillTable(response.data);
       addMoneyForm.updateUsersList(response.data);
       favoriteSpreadsheet.setMessage(true, 'Добавлен новый пользователь #' + addUser.id + ': ' + addUser.name);
    }
    favoriteSpreadsheet.setMessage(false, 'Ошибка: ' + response.error);
});

favoriteSpreadsheet.removeUserCallback = deletedUser => ApiConnector.removeUserFromFavorites(deletedUser, response => {
    if (response.success) {
       favoriteSpreadsheet.clearTable();
       favoriteSpreadsheet.fillTable(response.data);
       addMoneyForm.updateUsersList(response.data);
       favoriteSpreadsheet.setMessage(true, 'Пользователь ' + deletedUser + ' удален');
    }
    favoriteSpreadsheet.setMessage(false, 'Ошибка: ' + response.error);
});