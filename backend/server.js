
const express = require('express');
const cors = require('cors');

const fs = require('fs/promises');
const path = require('path');
const db = require('./database');
const crypto = require('node:crypto');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
// Securely hash passwords
function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { salt, hash };
}

// Read the login session token from the browser cookie
function getSessionToken(req) {
  const cookies = (req.headers.cookie || '').split(';');
  const sessionCookie = cookies
    .map(cookie => cookie.trim())
    .find(cookie => cookie.startsWith('sid='));

  return sessionCookie ? sessionCookie.slice(4) : null;
}

// Create a login session
function createSession(userId, res) {
  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const now = new Date();
  const expiresAt = new Date(
    now.getTime() + 7 * 24 * 60 * 60 * 1000
  ).toISOString();

  db.prepare(`
    INSERT INTO auth_sessions
    (token_hash, user_id, expires_at, created_at)
    VALUES (?, ?, ?, ?)
  `).run(tokenHash, userId, expiresAt, now.toISOString());

  const secureCookie =
    process.env.NODE_ENV === 'production' ? '; Secure' : '';

  res.setHeader(
    'Set-Cookie',
    `sid=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=604800${secureCookie}`
  );
}

// Verify that the user has a valid login session
function requireAuth(req, res, next) {
  const token = getSessionToken(req);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Please log in to continue.'
    });
  }

  const tokenHash = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const session = db.prepare(`
    SELECT user_id
    FROM auth_sessions
    WHERE token_hash = ? AND expires_at > ?
  `).get(tokenHash, new Date().toISOString());

  if (!session) {
    return res.status(401).json({
      success: false,
      message: 'Your session is invalid or expired. Please log in again.'
    });
  }

  const user = db.prepare(`
   SELECT id, name, email, phone, gender, age
    FROM users
    WHERE id = ?
  `).get(session.user_id);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'User account not found. Please log in again.'
    });
  }

  req.user = user;
  next();
}
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
    const { customerName, items, total, address, paymentMethod } = req.body;

    // Validate the order
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item'
      });
    }

    const orderTotal = Number(total);

    const allowedPaymentMethods = ['COD', 'UPI_DEMO', 'CARD_DEMO'];

if (!allowedPaymentMethods.includes(paymentMethod)) {
  return res.status(400).json({
    success: false,
    message: 'Please select a valid payment method.'
  });
}

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
      paymentMethod,
      status: 'Received',
      createdAt: new Date().toISOString()
    };

    // Insert the order into SQLite
    const insertOrder = db.prepare(`
      INSERT INTO orders
         (id, customer_name, address, items, total, payment_method, status, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertOrder.run(
      newOrder.id,
      newOrder.customerName,
      newOrder.address,
      JSON.stringify(newOrder.items),
      newOrder.total,
      newOrder.paymentMethod,
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
        payment_method AS paymentMethod,
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
// Register a new user
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, phone, gender, age } = req.body || {};
  console.log('Signup received:', { email, gender, age });

  if (
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    !name.trim() ||
    !email.trim() ||
    !password
  ) {
    return res.status(400).json({
      success: false,
      message: 'Name, email and password are required.'
    });
  }

  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();
  const cleanPhone =
    typeof phone === 'string' ? phone.trim() : '';

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return res.status(400).json({
      success: false,
      message: 'Please enter a valid email address.'
    });
  }

  if (password.length < 8 || password.length > 128) {
    return res.status(400).json({
      success: false,
      message: 'Password must be between 8 and 128 characters.'
    });
  }

  const { salt, hash } = hashPassword(password);

  try {
    const result = db.prepare(
  `INSERT INTO users
  (name, email, phone, gender, age, password_salt, password_hash, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
).run(
  cleanName,
  cleanEmail,
  cleanPhone || null,
  gender,
  age,
  salt,
  hash,
  new Date().toISOString()
);

    const user = {
  id: Number(result.lastInsertRowid),
  name: cleanName,
  email: cleanEmail,
  phone: cleanPhone || null,
  gender: gender,
  age: age
};

    createSession(user.id, res);

    return res.status(201).json({
      success: true,
      message: 'Registration successful.',
      user
    });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({
        success: false,
        message: 'This email is already registered.'
      });
    }

    console.error('Registration error:', error);

    return res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.'
    });
  }
});
// Log in an existing user
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};

  if (
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    !email.trim() ||
    !password
  ) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required.'
    });
  }

  const cleanEmail = email.trim().toLowerCase();

  const userRecord = db.prepare(`
  SELECT id, name, email, phone, gender, age, password_salt, password_hash
    FROM users
    WHERE email = ?
  `).get(cleanEmail);

  if (!userRecord) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password.'
    });
  }

  const { hash } = hashPassword(
    password,
    userRecord.password_salt
  );

  const submittedHash = Buffer.from(hash, 'hex');
  const savedHash = Buffer.from(userRecord.password_hash, 'hex');

  if (
    submittedHash.length !== savedHash.length ||
    !crypto.timingSafeEqual(submittedHash, savedHash)
  ) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password.'
    });
  }

  const user = {
  id: userRecord.id,
  name: userRecord.name,
  email: userRecord.email,
  phone: userRecord.phone,
  gender: userRecord.gender,
  age: userRecord.age
};

  try {
    createSession(user.id, res);

    return res.json({
      success: true,
      message: 'Login successful.',
      user
    });
  } catch (error) {
    console.error('Login error:', error);

    return res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.'
    });
  }
});
// Check the currently logged-in user
app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

// Log out the current user
app.post('/api/auth/logout', (req, res) => {
  const token = getSessionToken(req);

  if (token) {
    const tokenHash = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    db.prepare(`
      DELETE FROM auth_sessions
      WHERE token_hash = ?
    `).run(tokenHash);
  }

  const secureCookie =
    process.env.NODE_ENV === 'production' ? '; Secure' : '';

  res.setHeader(
    'Set-Cookie',
    `sid=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0${secureCookie}`
  );

  res.json({
    success: true,
    message: 'Logged out successfully.'
  });
});
// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});