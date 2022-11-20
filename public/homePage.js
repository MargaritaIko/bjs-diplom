const logout = new LogoutButton();
logout.action = exit => ApiConnector.logout(response => {
    if (response.success) {
        location.reload();
        return;
    }
});

ApiConnector.current(current => {
    if (current.success) {
        ProfileWidget.showProfile(current.data);
        return;
    }
});

const spreadsheet = new RatesBoard();
function ratesUpdate() {
    ApiConnector.getStocks(response => {
        if (response.success) {
           spreadsheet.clearTable();
           spreadsheet.fillTable(response.data);
           return;
        }
    });
}
setInterval(ratesUpdate(), 1000);

const addMoneyForm = new MoneyManager();
addMoneyForm.addMoneyCallback = receipts => ApiConnector.addMoney(receipts, response => {
    if (response.success) {
       addMoneyForm.addMoneyAction();
       ProfileWidget.showProfile(response.data);
       return addMoneyForm.setMessage(true, 'Успешное пополнение счета на' + receipts.currency + receipts.amount);;
    }
    return addMoneyForm.setMessage(false, 'Ошибка: ' + response.error);
});

addMoneyForm.conversionMoneyCallback = exchange => ApiConnector.convertMoney(exchange, response => {
    if (response.success) {
       addMoneyForm.conversionMoneyAction();
       ProfileWidget.showProfile(response.data);
       return addMoneyForm.setMessage(true, 'Успешная конвертация суммы ' + exchange.fromCurrency + exchange.fromAmount);
    }
    return addMoneyForm.setMessage(false, 'Ошибка: ' + response.error);
});

addMoneyForm.sendMoneyCallback = transfer => ApiConnector.transferMoney(transfer, response => {
    if (response.success) {
       addMoneyForm.sendMoneyAction();
       ProfileWidget.showProfile(response.data);
       return addMoneyForm.setMessage(true, 'Успешный перевод ' + transfer.currency + transfer.amount + ' получателю ' + transfer.to);
    }
    return addMoneyForm.setMessage(false, 'Ошибка: ' + response.error);
});

const favoriteSpreadsheet = new FavoritesWidget();
ApiConnector.getFavorites(response => {
    if (response.success) {
       favoriteSpreadsheet.clearTable();
       favoriteSpreadsheet.fillTable(response.data);
       addMoneyForm.updateUsersList(response.data);
       return;
    }
 });

 favoriteSpreadsheet.addUserCallback = addUser => ApiConnector.addUserToFavorites(addUser, response => {
    if (response.success) {
       favoriteSpreadsheet.clearTable();
       favoriteSpreadsheet.fillTable(response.data);
       addMoneyForm.updateUsersList(response.data);
       return addMoneyForm.setMessage(true, 'Добавлен новый пользователь #' + addUser.id + ': ' + addUser.name);
    }
    return addMoneyForm.setMessage(false, 'Ошибка: ' + response.error);
});

favoriteSpreadsheet.removeUserCallback = deletedUser => ApiConnector.removeUserFromFavorites(deletedUser, response => {
    if (response.success) {
       favoriteSpreadsheet.clearTable();
       favoriteSpreadsheet.fillTable(response.data);
       addMoneyForm.updateUsersList(response.data);
       return addMoneyForm.setMessage(true, 'Пользователь ' + deletedUser + ' удален');
    }
    return addMoneyForm.setMessage(false, 'Ошибка: ' + response.error);
});