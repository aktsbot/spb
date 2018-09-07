const config = require('./config');
const express = require('express');
const morgan = require('morgan');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const random = require('crypto-random-string');
const multer = require('multer');
const upload = multer();

const app = express();

app.use((req, res, next) => {
  res.set('Content-Type', 'text/plain');
  next();
});

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
app.get('/', (req, res) => {
  const html = `
  spb(1)                          SPB                          spb(1)

  NAME
      spb: [s]imple [p]aste[b]in.

  SYNOPSIS
      <command> | curl -F 'spb=<-' ${config.host}

  DESCRIPTION
      As of now, spb only accepts text (as a pastebin should)
      and the payload should be send a multipart-formdata.
      Inspiration from https://github.com/rupa/sprunge.

  EXAMPLES
      ~$ cat ~/tmp/foo.txt | curl -F 'spb=<-' ${config.host}
         ${config.host}/f85c64
      ~$ firefox ${config.host}/f85c64

  SEE ALSO
      https://github.com/aktsbot/spb
  `;

  return res.status(200).send(html);
});

app.post('/', upload.none(), async (req, res) => {
  try {
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
  } catch (e) {
    return res.status(500).send('save met unexpected errors\n');
  }
});

app.get('/:gid', async (req, res) => {
  try {
    if (req.params.gid && req.params.gid.length < 6) {
      return res.status(400).send('bad data\n');
    }

    let p_find = await Paste.findOne({ id_gen: req.params.gid }, { content: 1 });

    if (!p_find) {
      return res.status(404).send('not found\n');
    }

    return res.status(200).send(`${p_find.content}`);
  } catch (e) {
    return res.status(500).send('fetch met unexpected errors\n');
  }
});
// routes - end

app.listen(config.port, () => {
  console.log(`[spb] app listening on port ${config.port}`);
});
