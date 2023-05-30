const sqlite3 = require('sqlite3').verbose();

// open the database connection
const db = new sqlite3.Database('./data/dalle.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
});
db.run(`CREATE TABLE IF NOT EXISTS requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    prompt BLOB NOT NULL,
    filename TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`);
module.exports = db;