// routes/auth.js — Login & Register
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const db     = require('../models/db');

// ===== REGISTER =====
router.post('/register', async (req, res) => {
  try {
    const { nama, email, password, no_hp } = req.body;

    // Validasi field
    if (!nama || !email || !password || !no_hp) {
      return res.status(400).json({ message: 'Semua field wajib diisi' });
    }

    // Cek email sudah terdaftar
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Simpan user baru
    const [result] = await db.query(
      'INSERT INTO users (nama, email, password, no_hp) VALUES (?, ?, ?, ?)',
      [nama, email, hash, no_hp]
    );

    res.status(201).json({
      message: 'Registrasi berhasil',
      userId: result.insertId
    });

  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// ===== LOGIN =====
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan password wajib diisi' });
    }

    // Cari user
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    const user = users[0];

    // Cek password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    // Buat token JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login berhasil',
      token,
      user: {
        id:   user.id,
        nama: user.nama,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

module.exports = router;