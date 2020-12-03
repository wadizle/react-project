"use strict";

var ApiDemo = function ApiDemo(props) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "See Console for data from API"));
};

var getInfo = function getInfo() {
  sendAjax('GET', '/getInfo', null, function (result) {
    console.log(result.data);
    ReactDOM.render( /*#__PURE__*/React.createElement(ApiDemo, {
      data: result.data
    }), document.querySelector("#content"));
  });
};

$(document).ready(function () {
  //getToken();
  getInfo();
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
