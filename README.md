# spb - Simple PasteBin

## What?

This is a simple pastebin made with `node.js` &amp; a `sqlite3` backend.

The old mongodb codebase is in the [mongodb](https://github.com/aktsbot/spb/tree/mongodb) branch.

## Why ?

I needed my own pastebin for "research" ;)

## How ?

- clone the repo
- take a look at [config.js](./config.js)
- `$ npm install`
- Get sqlite database ready
  ```
  sqlite3 spb.db < sql/pastes.sql
  ```
- `$ npm start`
- pop open `http://localhost:3030` on the browser

## Can I see ?

https://spb.aktsbot.in

## Inspiration

- http://sprunge.us/
- http://ix.io/

## License

[WTFPL](http://www.wtfpl.net/)
