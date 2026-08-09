// routes/omset.js — API Omset & Statistik
const router = require('express').Router();
const db     = require('../models/db');
const auth   = require('../middleware/auth');

// GET /api/omset/harian?tanggal=2026-07-20
// Omset per hari: total, cash, qris, transfer
router.get('/harian', auth, async (req, res) => {
  try {
    const tanggal = req.query.tanggal || new Date().toISOString().split('T')[0];
    const [rows] = await db.query(`
      SELECT
        COUNT(*) as total_booking,
        SUM(CASE WHEN status_bayar='lunas' THEN nominal_bayar ELSE 0 END) as total_omset,
        SUM(CASE WHEN metode_bayar='cash'     AND status_bayar='lunas' THEN nominal_bayar ELSE 0 END) as omset_cash,
        SUM(CASE WHEN metode_bayar='qris'     AND status_bayar='lunas' THEN nominal_bayar ELSE 0 END) as omset_qris,
        SUM(CASE WHEN metode_bayar='transfer' AND status_bayar='lunas' THEN nominal_bayar ELSE 0 END) as omset_transfer,
        COUNT(CASE WHEN status_bayar='lunas'     THEN 1 END) as sudah_bayar,
        COUNT(CASE WHEN status_bayar='belum_lunas' THEN 1 END) as belum_bayar
      FROM bookings
      WHERE tanggal_servis = ?
    `, [tanggal]);
    res.json({ tanggal, data: rows[0] });
  } catch (err) {
    console.error('Omset harian error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// GET /api/omset/mingguan — omset 7 hari terakhir per hari
router.get('/mingguan', auth, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        tanggal_servis as tanggal,
        SUM(CASE WHEN status_bayar='lunas' THEN nominal_bayar ELSE 0 END) as total_omset,
        SUM(CASE WHEN metode_bayar='cash'     AND status_bayar='lunas' THEN nominal_bayar ELSE 0 END) as omset_cash,
        SUM(CASE WHEN metode_bayar='qris'     AND status_bayar='lunas' THEN nominal_bayar ELSE 0 END) as omset_qris,
        SUM(CASE WHEN metode_bayar='transfer' AND status_bayar='lunas' THEN nominal_bayar ELSE 0 END) as omset_transfer,
        COUNT(*) as total_booking,
        COUNT(CASE WHEN status_bayar='lunas' THEN 1 END) as sudah_bayar
      FROM bookings
      WHERE tanggal_servis >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
        AND tanggal_servis <= CURDATE()
      GROUP BY tanggal_servis
      ORDER BY tanggal_servis ASC
    `);
    res.json({ data: rows });
  } catch (err) {
    console.error('Omset mingguan error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// GET /api/omset/bulanan — omset 30 hari terakhir per hari
router.get('/bulanan', auth, async (req, res) => {
  try {
    const bulan = req.query.bulan || new Date().toISOString().slice(0, 7); // YYYY-MM
    const [rows] = await db.query(`
      SELECT
        tanggal_servis as tanggal,
        SUM(CASE WHEN status_bayar='lunas' THEN nominal_bayar ELSE 0 END) as total_omset,
        SUM(CASE WHEN metode_bayar='cash'     AND status_bayar='lunas' THEN nominal_bayar ELSE 0 END) as omset_cash,
        SUM(CASE WHEN metode_bayar='qris'     AND status_bayar='lunas' THEN nominal_bayar ELSE 0 END) as omset_qris,
        COUNT(*) as total_booking
      FROM bookings
      WHERE DATE_FORMAT(tanggal_servis, '%Y-%m') = ?
      GROUP BY tanggal_servis
      ORDER BY tanggal_servis ASC
    `, [bulan]);
    res.json({ bulan, data: rows });
  } catch (err) {
    console.error('Omset bulanan error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// PUT /api/omset/bayar/:id — update pembayaran booking
router.put('/bayar/:id', auth, async (req, res) => {
  try {
    const { metode_bayar, nominal_bayar } = req.body;
    if (!metode_bayar || !nominal_bayar) {
      return res.status(400).json({ message: 'Metode dan nominal bayar wajib diisi' });
    }
    await db.query(
      `UPDATE bookings SET
         metode_bayar  = ?,
         nominal_bayar = ?,
         status_bayar  = 'lunas',
         waktu_bayar   = NOW()
       WHERE id = ?`,
      [metode_bayar, nominal_bayar, req.params.id]
    );
    res.json({ message: 'Pembayaran berhasil dicatat' });
  } catch (err) {
    console.error('Update bayar error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

module.exports = router;