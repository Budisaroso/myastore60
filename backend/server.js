// server.js — MyAstore60 Backend
const express = require('express');
const cors    = require('cors');
const path    = require('path');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 3000;

// ===== MIDDLEWARE =====
app.use(cors({
  origin: [
    'https://budisaroso.github.io',
    'http://127.0.0.1:5500',
    'http://localhost:5500',
    'http://localhost:3000'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== SAJIKAN FRONTEND =====
app.use(express.static(path.join(__dirname, '../frontend')));

// ===== API ROUTES =====
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/booking', require('./routes/booking'));
app.use('/api/antrian', require('./routes/antrian'));
app.use('/api/services', require('./routes/services'));
app.use('/api/omset', require('./routes/omset'));
// ===== ROUTE UTAMA =====
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// 404 handler untuk API
app.use('/api', (req, res) => {
  res.status(404).json({ message: 'Endpoint tidak ditemukan' });
});

// ===== JALANKAN SERVER =====
app.listen(PORT, () => {
  console.log('========================================');
  console.log(`🚀 MyAstore60 Server berjalan!`);
  console.log(`📡 http://localhost:${PORT}`);
  console.log('========================================');
});