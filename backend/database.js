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
// Add payment_method column to existing orders table
const orderColumns = db.prepare('PRAGMA table_info(orders)').all();

if (!orderColumns.some(column => column.name === 'payment_method')) {
  db.exec(
    "ALTER TABLE orders ADD COLUMN payment_method TEXT NOT NULL DEFAULT 'COD'"
  );
}

// Create a table to store registered users
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL COLLATE NOCASE UNIQUE,
    phone TEXT,
    password_salt TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS auth_sessions (
    token_hash TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);
// Add gender and age columns if they do not exist
const userColumns = db.prepare('PRAGMA table_info(users)').all();

if (!userColumns.some(column => column.name === 'gender')) {
  db.exec('ALTER TABLE users ADD COLUMN gender TEXT');
}

if (!userColumns.some(column => column.name === 'age')) {
  db.exec('ALTER TABLE users ADD COLUMN age INTEGER');
}

console.log('SQLite database and orders table are ready.');

module.exports = db;