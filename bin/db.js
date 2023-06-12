const sqlite3 = require('sqlite3').verbose();
const colors = require('colors');

// open the database connection
const db = new sqlite3.Database('./data/dalle.db', (err) => {
  if (err) {
    console.error(colors.red(err.message));
  }
  console.log(colors.green('db ready'));
});
db.run(`CREATE TABLE IF NOT EXISTS requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    prompt BLOB NOT NULL,
    filename TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`);
module.exports = db;