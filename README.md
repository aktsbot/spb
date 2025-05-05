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

## Migration from mongodb to sqlite3

The initial version of spb was built to use mongodb for its database. This new version
will be using sqlite. 

If you have a good chunk of pastes that you wish to move over, here's what you do

- hop on the vm and take a mongodb dump like so
  ```
  mongoexport -d spb -c pastes --jsonArray -o pastes.json
  ```
  this create a `pastes.json` file which holds all of your old data.

- copy the `pastes.json` file into the `extras` folder and then run 
  ```
  node extras/mongo_migrate.js
  ```

## License

[WTFPL](http://www.wtfpl.net/)
