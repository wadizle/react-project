const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getInfo', controllers.Transaction.getInfo);
  app.post('/getCurrentPrice', controllers.Transaction.getCurrentPrice);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/profile', mid.requiresLogin, controllers.Transaction.profilePage);
  app.get('/transaction', mid.requiresLogin, controllers.Transaction.transactionPage);
  app.post('/makeTransaction', mid.requiresLogin, controllers.Transaction.transact);
  app.get('/getProfile', mid.requiresLogin, controllers.Account.getProfile);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.get('/getTransactions', mid.requiresLogin, controllers.Transaction.getTransactions);
  app.post('/updatePassword', mid.requiresLogin, controllers.Account.updatePassword);
};

module.exports = router;
