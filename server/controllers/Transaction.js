const fetch = require('node-fetch');
const models = require('../models');

const { Transaction } = models;

const makeTransaction = (req, res) => {
  if (!req.body.symbol || !req.body.amount || !req.body.price) {
    return res.status(400).json({ error: 'All fields required' });
  }

  if (!parseInt(req.body.amount, 10)) {
    return res.status(400).json({ error: 'Amount must be a number' });
  }
  if (!parseInt(req.body.price, 10)) {
    return res.status(400).json({ error: 'Price must be a number' });
  }

  const transactionData = {
    symbol: req.body.symbol,
    amount: req.body.amount,
    price: req.body.price,
    owner: req.session.account._id,
  };

  const newTransaction = new Transaction.TransactionModel(transactionData);

  const transactionPromise = newTransaction.save();

  transactionPromise.then(() => res.json({ redirect: '/profile' }));

  transactionPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Transaction already exists.' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return transactionPromise;
};

const getTransactions = (request, response) => {
  const req = request;
  const res = response;

  return Transaction.TransactionModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.json({ transactions: docs });
  });
};

const profilePage = (req, res) => {
  Transaction.TransactionModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    // console.log(docs);
    return res.render('app', { csrfToken: req.csrfToken(), transactions: docs });
    // return res.render('app', { csrfToken: req.csrfToken() });
  });
  // return res.render('app', { csrfToken: req.csrfToken() });
};

const transactionPage = (req, res) => {
  res.render('api', { csrfToken: req.csrfToken() });
};

const getCurrentPrice = (request, response) => {
  if (!request.body.symbol) {
    return response.status(400).json({ error: 'Symbol is required' });
  }
  let url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=';
  url += `${request.body.symbol}&apikey=7TOGNX0K59HTDC9C`;
  return fetch(url)
    .then((res) => res.json())
    .then((body) => {
      if (!body['Error Message']) {
        response.json({ data: body['Time Series (Daily)'][body['Meta Data']['3. Last Refreshed']]['4. close'] });
      } else {
        response.json({ data: 'Invalid Symbol' });
      }
    });
};

const getInfo = (request, response) => {
  const url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=IBM&apikey=7TOGNX0K59HTDC9C';
  fetch(url)
    .then((res) => res.json())
    .then((body) => response.json({ data: body }));
};

module.exports.profilePage = profilePage;
module.exports.transactionPage = transactionPage;
module.exports.transact = makeTransaction;
module.exports.getInfo = getInfo;
module.exports.getCurrentPrice = getCurrentPrice;
module.exports.getTransactions = getTransactions;
