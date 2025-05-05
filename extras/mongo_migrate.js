import db from "../db.js";

import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const filePresent = fs.existsSync(__dirname + "/pastes.json");
if (!filePresent) {
  console.error(`pastes.json not present in extras folder`);
  process.exit(1);
}

import json from "./pastes.json" with { type: "json" };

function start() {
  try {
    for (const p of json) {
      const n_paste = {
        id_gen: p.id_gen,
        content: p.content,
        created_dt: new Date(p.created_dt["$date"]).toISOString(),
      };

      db.run(
        `INSERT INTO pastes (id_gen, content) VALUES (@id_gen, @content)`,
        n_paste
      );
    }
  } catch (e) {
    console.error(e);
  }
}

start();
