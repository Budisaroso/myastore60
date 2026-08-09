// routes/antrian.js — Antrian publik hari ini
const router = require('express').Router();
const db     = require('../models/db');

// GET /api/antrian?tanggal=2026-06-03
router.get('/', async (req, res) => {
  try {
    const tanggal = req.query.tanggal || new Date().toISOString().split('T')[0];
    const [rows] = await db.query(
      `SELECT
         ROW_NUMBER() OVER (ORDER BY jam_servis ASC) AS nomor_antrian,
         jam_servis, status
       FROM bookings
       WHERE tanggal_servis = ? AND status NOT IN ('Dibatalkan')
       ORDER BY jam_servis ASC`,
      [tanggal]
    );
    const total      = rows.length;
    const selesai    = rows.filter(r => r.status === 'Selesai').length;
    const dikerjakan = rows.filter(r => r.status === 'Sedang Dikerjakan').length;
    const menunggu   = rows.filter(r => ['Menunggu Konfirmasi','Dikonfirmasi'].includes(r.status)).length;
    res.json({ tanggal, total, selesai, dikerjakan, menunggu, antrian: rows });
  } catch (err) {
    console.error('Antrian error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// GET /api/antrian/posisi/:nomor
router.get('/posisi/:nomor', async (req, res) => {
  try {
    const { nomor } = req.params;
    const [booking] = await db.query(
      'SELECT tanggal_servis, jam_servis, status FROM bookings WHERE nomor_booking = ?',
      [nomor]
    );
    if (booking.length === 0) return res.status(404).json({ message: 'Booking tidak ditemukan' });
    const b = booking[0];
    const [semua] = await db.query(
      `SELECT nomor_booking, jam_servis, status
       FROM bookings
       WHERE tanggal_servis = ? AND status NOT IN ('Dibatalkan')
       ORDER BY jam_servis ASC`,
      [b.tanggal_servis]
    );
    const posisi         = semua.findIndex(x => x.nomor_booking === nomor) + 1;
    const totalAntrian   = semua.length;
    const selesaiSebelum = semua.slice(0, posisi-1).filter(x => x.status === 'Selesai').length;
    const sisaSebelum    = (posisi - 1) - selesaiSebelum;
    res.json({ nomor_booking: nomor, posisi, total_antrian: totalAntrian, sisa_sebelum: sisaSebelum, status: b.status, jam_servis: b.jam_servis, tanggal_servis: b.tanggal_servis });
  } catch (err) {
    console.error('Posisi error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

module.exports = router;