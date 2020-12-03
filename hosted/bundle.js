"use strict";

var getCurrentPrice = function getCurrentPrice(e) {
  e.preventDefault();

  if ($().val("#symbol") == '') {
    handleError("All fields are required");
    return false;
  } //console.log($("#searchForm").serialize());


  sendAjax('POST', '/getCurrentPrice', $("#searchForm").serialize(), function (result) {
    //console.log(document.querySelector("#symbol").value);
    ReactDOM.render( /*#__PURE__*/React.createElement(BuyForm, {
      symbol: document.querySelector("#symbol").value,
      price: result.data,
      csrf: document.querySelector("#csrf").value
    }), document.querySelector("#transactions"));
  });
  return false;
};

var SearchForm = function SearchForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "searchForm",
    name: "searchForm",
    onSubmit: getCurrentPrice,
    action: "/getInfo",
    method: "POST",
    className: "transactionForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "symbol"
  }, "Search Company: "), /*#__PURE__*/React.createElement("input", {
    id: "symbol",
    type: "text",
    name: "symbol",
    placeholder: "Symbol (ex: IBM)"
  }), /*#__PURE__*/React.createElement("input", {
    id: "csrf",
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "makeTransactionSubmit",
    type: "submit",
    value: "Search"
  }));
};

var buyStock = function buyStock(e) {
  e.preventDefault();

  if ($().val("#amount") == '' || $().val("#amount") == 0) {
    handleError("Please Enter an Amount to Buy");
    return false;
  }

  sendAjax('POST', '/makeTransaction', $("#buyForm").serialize(), function (result) {
    location.reload();
  });
  return false;
};

var BuyForm = function BuyForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "buyForm",
    name: "buyForm",
    onSubmit: buyStock,
    action: "/getInfo",
    method: "GET",
    className: "buyForm"
  }, /*#__PURE__*/React.createElement("span", null, props.symbol, ":"), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "symbol",
    value: props.symbol
  }), /*#__PURE__*/React.createElement("span", null, " $", props.price, " each"), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "price",
    value: props.price
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "amount"
  }, "Buy: "), /*#__PURE__*/React.createElement("input", {
    id: "amount",
    type: "number",
    min: "0",
    max: "1000",
    name: "amount",
    placeholder: "Quantity"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "makeTransactionSubmit",
    type: "submit",
    value: "Buy"
  }));
};

var TransactionList = function TransactionList(props) {
  if (props.transactions.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "transactionList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyTransaction"
    }, "No History yet"));
  }

  var transactionNodes = props.transactions.map(function (transaction) {
    return /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, transaction.symbol), /*#__PURE__*/React.createElement("td", null, transaction.amount), /*#__PURE__*/React.createElement("td", null, transaction.price));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "transactionList"
  }, /*#__PURE__*/React.createElement("h1", null, "Your Stocks:"), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Company"), /*#__PURE__*/React.createElement("th", null, "Amount"), /*#__PURE__*/React.createElement("th", null, "Price")), transactionNodes);
};

var updatePassword = function updatePassword(e) {
  e.preventDefault();
  sendAjax('POST', '/updatePassword', $("#newPassForm").serialize(), function (data) {
    location.reload();
  });
  return false;
};

var UserProfile = function UserProfile(props) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "Username: "), /*#__PURE__*/React.createElement("p", null, " ", props.profile.username), /*#__PURE__*/React.createElement("h3", null, "Account Created: "), /*#__PURE__*/React.createElement("p", null, " ", props.profile.createdDate), /*#__PURE__*/React.createElement("form", {
    id: "newPassForm",
    name: "newPassForm",
    onSubmit: updatePassword,
    action: "/updatePassword",
    method: "POST",
    className: "newPassForm"
  }, /*#__PURE__*/React.createElement("h1", null, "Reset Password Here (will log user out)"), /*#__PURE__*/React.createElement("label", {
    htmlFor: "pass"
  }, "Password: "), /*#__PURE__*/React.createElement("input", {
    type: "password",
    name: "pass",
    placeholder: "password"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "pass2"
  }, "Retype Password: "), /*#__PURE__*/React.createElement("input", {
    type: "password",
    name: "pass2",
    placeholder: "retype password"
  }), /*#__PURE__*/React.createElement("input", {
    id: "csrf",
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("input", {
    className: "makeTransactionSubmit",
    type: "submit",
    value: "Reset"
  })));
};

var loadTransactionsFromServer = function loadTransactionsFromServer() {
  sendAjax('GET', '/getTransactions', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(TransactionList, {
      transactions: data.transactions
    }), document.querySelector("#transactions"));
  });
};

var createTransactionWindow = function createTransactionWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(SearchForm, {
    csrf: csrf
  }), document.querySelector("#makeTransactions"));
  ReactDOM.render( /*#__PURE__*/React.createElement(TransactionList, {
    transactions: []
  }), document.querySelector("#transactions"));
  loadTransactionsFromServer();
};

var createProfileWindow = function createProfileWindow(csrf) {
  ReactDOM.render(null, document.querySelector("#makeTransactions"));
  sendAjax('GET', '/getProfile', null, function (data) {
    //console.log(data);
    ReactDOM.render( /*#__PURE__*/React.createElement(UserProfile, {
      profile: data.profile,
      csrf: csrf
    }), document.querySelector("#transactions"));
  });
};

var setup = function setup(csrf) {
  var transactionButton = document.querySelector("#showTransactions");
  var profileButton = document.querySelector("#showProfile");
  transactionButton.addEventListener("click", function (e) {
    e.preventDefault();
    createTransactionWindow(csrf);
    return false;
  });
  profileButton.addEventListener("click", function (e) {
    e.preventDefault();
    createProfileWindow(document.querySelector("#csrf").value);
    return false;
  });
  createTransactionWindow(csrf);
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  //$("#errorMessage").text(message);
  //$("#domoMessage").animate({width:'toggle'},350);
  console.log(message);
};

var redirect = function redirect(response) {
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
