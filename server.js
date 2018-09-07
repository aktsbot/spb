const config = require('./config');
const express = require('express');
const morgan = require('morgan');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bp = require('body-parser');
const random = require('crypto-random-string');

const app = express();

// request body access
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

// enable logging
app.use(morgan('short'));

// connecting to our database
mongoose.connect(
  config.db,
  { useMongoClient: true }
);
mongoose.connection.on('error', console.error.bind(console, '[spb] db connection error'));
mongoose.connection.once('open', () => {
  console.log('[spb] db connection sucess');
});

// routes - start
app.get('/h', (req, res) => {
  return res.status(200).send('OK');
});

// routes - end

app.listen(config.port, () => {
  console.log(`[spb] app listening on port ${config.port}`);
});
