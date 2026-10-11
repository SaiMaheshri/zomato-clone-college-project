const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');

// Create a persistent SQLite database file
const db = new DatabaseSync(
  path.join(__dirname, 'zomato.db')
);

// Create the orders table if it does not exist
db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY,
    customer_name TEXT NOT NULL,
    address TEXT NOT NULL,
    items TEXT NOT NULL,
    total REAL NOT NULL,
    status TEXT NOT NULL,
    created_at TEXT NOT NULL
  )
`);

console.log('SQLite database and orders table are ready.');

module.exports = db;