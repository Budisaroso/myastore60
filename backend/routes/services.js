// routes/services.js — CRUD Paket Harga
const router = require('express').Router();
const db     = require('../models/db');
const auth   = require('../middleware/auth');

// GET /api/services — semua paket (publik)
router.get('/', async (req, res) => {
  try {
    const { jenis_motor, cc, tipe } = req.query;
    let query  = 'SELECT * FROM services WHERE is_active = 1';
    let params = [];
    if (jenis_motor) { query += ' AND jenis_motor = ?'; params.push(jenis_motor); }
    if (cc)          { query += ' AND cc = ?';          params.push(cc); }
    if (tipe)        { query += ' AND tipe = ?';        params.push(tipe); }
    query += ' ORDER BY tipe ASC, nama_paket ASC, jenis_motor ASC';
    const [rows] = await db.query(query, params);
    res.json({ services: rows, total: rows.length });
  } catch (err) {
    console.error('Get services error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// GET /api/services/all — semua termasuk nonaktif (admin)
router.get('/all', auth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM services ORDER BY tipe ASC, nama_paket ASC, jenis_motor ASC');
    res.json({ services: rows, total: rows.length });
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// POST /api/services — tambah paket baru (admin)
router.post('/', auth, async (req, res) => {
  try {
    const { nama_paket, tipe, harga_normal, harga_promo, jenis_motor, cc, deskripsi } = req.body;
    if (!nama_paket || !tipe || !harga_normal || !harga_promo || !jenis_motor || !cc) {
      return res.status(400).json({ message: 'Semua field wajib diisi' });
    }
    const [result] = await db.query(
      'INSERT INTO services (nama_paket, tipe, harga_normal, harga_promo, jenis_motor, cc, deskripsi) VALUES (?,?,?,?,?,?,?)',
      [nama_paket, tipe, harga_normal, harga_promo, jenis_motor, cc, deskripsi || null]
    );
    res.status(201).json({ message: 'Paket berhasil ditambahkan', id: result.insertId });
  } catch (err) {
    console.error('Add service error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// PUT /api/services/:id — update paket (admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const { nama_paket, tipe, harga_normal, harga_promo, jenis_motor, cc, deskripsi, is_active } = req.body;
    await db.query(
      'UPDATE services SET nama_paket=?, tipe=?, harga_normal=?, harga_promo=?, jenis_motor=?, cc=?, deskripsi=?, is_active=? WHERE id=?',
      [nama_paket, tipe, harga_normal, harga_promo, jenis_motor, cc, deskripsi || null, is_active ?? 1, req.params.id]
    );
    res.json({ message: 'Paket berhasil diupdate' });
  } catch (err) {
    console.error('Update service error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// DELETE /api/services/:id — hapus paket (admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM services WHERE id = ?', [req.params.id]);
    res.json({ message: 'Paket berhasil dihapus' });
  } catch (err) {
    console.error('Delete service error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

module.exports = router;