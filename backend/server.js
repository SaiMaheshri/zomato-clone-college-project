
const express = require('express');
const cors = require('cors');

const fs = require('fs/promises');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Home route
// Serve the frontend website
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Serve the frontend CSS
app.get('/style.css', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'style.css'));
});

// Serve the frontend JavaScript
app.get('/script.js', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'script.js'));
});

// Test API route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Backend is working properly'
  });
});

app.get('/api/restaurants', (req, res) => {
  const restaurants = [
    {
      id: 1,
      name: 'Biryani House',
      location: 'Jalgaon, Maharashtra',
      rating: 4.3,
      cuisine: 'Biryani'
    },
    {
      id: 2,
      name: 'Pizza Paradise',
      location: 'Bhusawal, Maharashtra',
      rating: 4.1,
      cuisine: 'Pizza'
    },
    {
      id: 3,
      name: 'Burger Barn',
      location: 'Dhule, Maharashtra',
      rating: 4.0,
      cuisine: 'Burgers'
    }
  ];

  res.json({
    success: true,
    count: restaurants.length,
    data: restaurants
  });
});

// Save a demo order in the SQLite database
app.post('/api/orders', (req, res) => {
  try {
    const { customerName, items, total, address } = req.body;

    // Validate the order
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item'
      });
    }

    const orderTotal = Number(total);

    if (!Number.isFinite(orderTotal) || orderTotal < 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order total'
      });
    }

    const newOrder = {
      id: Date.now(),
      customerName: String(customerName || 'Demo Customer').trim(),
      address: String(address || '').trim(),
      items,
      total: orderTotal,
      status: 'Received',
      createdAt: new Date().toISOString()
    };

    // Insert the order into SQLite
    const insertOrder = db.prepare(`
      INSERT INTO orders
        (id, customer_name, address, items, total, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insertOrder.run(
      newOrder.id,
      newOrder.customerName,
      newOrder.address,
      JSON.stringify(newOrder.items),
      newOrder.total,
      newOrder.status,
      newOrder.createdAt
    );

    res.status(201).json({
      success: true,
      message: 'Demo order saved successfully in SQLite',
      data: newOrder
    });

  } catch (error) {
    console.error('Order save error:', error);

    res.status(500).json({
      success: false,
      message: 'Could not save the order'
    });
  }
});

// Get all orders from the SQLite database
app.get('/api/orders', (req, res) => {
  try {
    const orders = db.prepare(`
      SELECT
        id,
        customer_name AS customerName,
        address,
        items,
        total,
        status,
        created_at AS createdAt
      FROM orders
      ORDER BY id ASC
    `).all();

    const formattedOrders = orders.map(order => ({
      ...order,
      items: JSON.parse(order.items)
    }));

    res.json({
      success: true,
      count: formattedOrders.length,
      data: formattedOrders
    });
  } catch (error) {
    console.error('Order read error:', error);

    res.status(500).json({
      success: false,
      message: 'Could not read orders from the database'
    });
  }
});
// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});