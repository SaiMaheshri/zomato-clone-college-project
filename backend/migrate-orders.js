const fs = require('node:fs');
const path = require('node:path');
const db = require('./database');

const filePath = path.join(__dirname, 'orders.json');

// Read orders saved in the old JSON file
if (!fs.existsSync(filePath)) {
  console.error('orders.json file was not found.');
  db.close();
  process.exitCode = 1;
} else {
  try {
    const orders = JSON.parse(
      fs.readFileSync(filePath, 'utf8')
    );

    if (!Array.isArray(orders)) {
      throw new Error('orders.json must contain an array.');
    }

    const insertOrder = db.prepare(`
      INSERT OR IGNORE INTO orders
      (id, customer_name, address, items, total, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    let imported = 0;
    let skipped = 0;

    for (const order of orders) {
      const id = Number(order.id);

      if (!Number.isSafeInteger(id) || id <= 0) {
        console.warn('Skipped an order with an invalid ID.');
        skipped++;
        continue;
      }

      const result = insertOrder.run(
        id,
        String(order.customerName || 'Demo Customer'),
        String(order.address || ''),
        JSON.stringify(order.items || []),
        Number(order.total || 0),
        String(order.status || 'Received'),
        String(order.createdAt || new Date().toISOString())
      );

      if (Number(result.changes) > 0) {
        imported++;
      } else {
        skipped++;
      }
    }

    console.log('Order migration completed!');
    console.log('Orders imported:', imported);
    console.log('Orders skipped:', skipped);
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exitCode = 1;
  } finally {
    db.close();
  }
}