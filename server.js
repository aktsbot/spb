import express from "express";
import morgan from "morgan";

import { nanoid } from "nanoid";

import multer from "multer";
const upload = multer();

import config from "./config.js";
import db from "./db.js";

const app = express();

app.use((req, res, next) => {
  res.set("Content-Type", "text/plain");
  next();
});

// enable logging
app.use(morgan("short"));

// routes - start
app.get("/", (req, res) => {
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

app.post("/", upload.none(), async (req, res) => {
  try {
    if (!req.body.spb) {
      return res.status(400).send("bad data\n");
    }

    let gid = nanoid(6);

    let n_paste = {
      id_gen: gid,
      content: req.body.spb,
    };

    db.run(
      `INSERT INTO pastes (id_gen, content) VALUES (@id_gen, @content)`,
      n_paste
    );

    return res.status(200).send(`${config.host}/${gid}\n`);
  } catch (e) {
    return res.status(500).send("save met unexpected errors\n");
  }
});

app.get("/:gid", async (req, res) => {
  try {
    if (req.params.gid && req.params.gid.length < 6) {
      return res.status(400).send("bad data\n");
    }

    const p_find = db.query(
      `SELECT content from pastes WHERE id_gen=@id_gen LIMIT 1`,
      {
        id_gen: req.params.gid,
      }
    );

    if (p_find.length === 0) {
      return res.status(404).send("not found\n");
    }

    return res.status(200).send(`${p_find[0]["content"]}`);
  } catch (e) {
    return res.status(500).send("fetch met unexpected errors\n");
  }
});
// routes - end

app.listen(config.port, () => {
  console.log(`[spb] app listening on port ${config.port}`);
});
