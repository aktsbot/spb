const config = require('./config');
const express = require('express');
const morgan = require('morgan');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const random = require('crypto-random-string');
const multer = require('multer');
const upload = multer();

const app = express();

// enable logging
app.use(morgan('short'));

// connecting to our database
mongoose.connect(config.db);
mongoose.connection.on('error', console.error.bind(console, '[spb] db connection error'));
mongoose.connection.once('open', () => {
  console.log('[spb] db connection sucess');
});

const Paste = require('./paste.model');

// routes - start
app.get('/h', (req, res) => {
  return res.status(200).send('OK\n');
});

app.post('/', upload.none(), async (req, res) => {
  if (!req.body.spb) {
    return res.status(400).send('bad data\n');
  }

  let gid = random(6);

  let n_paste = new Paste({
    id_gen: gid,
    content: req.body.spb
  });

  let n_save = await n_paste.save();

  if (!n_save) {
    return res.status(500).send('save failed\n');
  }

  return res.status(200).send(`${config.host}/${gid}\n`);
});

// routes - end

app.listen(config.port, () => {
  console.log(`[spb] app listening on port ${config.port}`);
});
