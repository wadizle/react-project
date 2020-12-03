const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let TransactionModel = {};

// comments
const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const TransactionSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  amount: {
    type: Number,
    required: true,
  },

  price: {
    type: Number,
    min: 0,
    required: true,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

TransactionSchema.statics.toAPI = (doc) => ({
  symbol: doc.symbol,
  amount: doc.amount,
  price: doc.price,
});

TransactionSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return TransactionModel.find(search).select('symbol amount price').lean().exec(callback);
};

TransactionModel = mongoose.model('Transaction', TransactionSchema);

module.exports.TransactionModel = TransactionModel;
module.exports.TransactionSchema = TransactionSchema;
