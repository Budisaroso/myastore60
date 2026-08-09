// bookingController.js — Logic Booking MyAstore60
const db = require('../models/db');

// Generate nomor booking unik
function generateNomor() {
  const tahun  = new Date().getFullYear();
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `MAS-${tahun}-${random}`;
}

// ===== BUAT BOOKING BARU =====
exports.buatBooking = async (req, res) => {
  try {
    const {
      nama_pelanggan, no_hp, email,
      merek_kendaraan, nopol, jenis_motor,
      layanan, keluhan, tanggal_servis,
      jam_servis, harga_normal, harga_total, catatan
    } = req.body;

    // Validasi field wajib
    if (!nama_pelanggan || !no_hp || !merek_kendaraan || !nopol ||
        !jenis_motor || !layanan || !tanggal_servis || !jam_servis) {
      return res.status(400).json({ message: 'Field wajib tidak lengkap' });
    }

    // Generate nomor booking unik
    let nomor_booking, exists = true;
    while (exists) {
      nomor_booking = generateNomor();
      const [cek] = await db.query(
        'SELECT id FROM bookings WHERE nomor_booking = ?', [nomor_booking]
      );
      exists = cek.length > 0;
    }

    // Simpan ke database
    const layananStr = Array.isArray(layanan) ? layanan.join(', ') : layanan;

    const [result] = await db.query(
      `INSERT INTO bookings
        (nomor_booking, nama_pelanggan, no_hp, email,
         merek_kendaraan, nopol, jenis_motor, layanan,
         keluhan, tanggal_servis, jam_servis,
         harga_normal, harga_total, catatan)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nomor_booking, nama_pelanggan, no_hp, email || null,
       merek_kendaraan, nopol, jenis_motor, layananStr,
       keluhan || null, tanggal_servis, jam_servis,
       harga_normal || 0, harga_total || 0, catatan || null]
    );

    res.status(201).json({
      message:       'Booking berhasil dibuat!',
      nomor_booking,
      booking_id:    result.insertId
    });

  } catch (err) {
    console.error('Buat booking error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

// ===== CEK STATUS BOOKING =====
exports.cekStatus = async (req, res) => {
  try {
    const { nomor } = req.params;

    const [rows] = await db.query(
      `SELECT nomor_booking, nama_pelanggan, merek_kendaraan,
              nopol, layanan, tanggal_servis, jam_servis,
              harga_total, status, created_at
       FROM bookings WHERE nomor_booking = ?`,
      [nomor]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Nomor booking tidak ditemukan' });
    }

    res.json({ booking: rows[0] });

  } catch (err) {
    console.error('Cek status error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

// ===== SEMUA BOOKING (Admin) =====
exports.semuaBooking = async (req, res) => {
  try {
    const { status, tanggal, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query  = 'SELECT * FROM bookings WHERE 1=1';
    let params = [];

    if (status)  { query += ' AND status = ?';        params.push(status); }
    if (tanggal) { query += ' AND tanggal_servis = ?'; params.push(tanggal); }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [rows]  = await db.query(query, params);
    const [total] = await db.query('SELECT COUNT(*) as total FROM bookings');

    res.json({
      bookings: rows,
      total:    total[0].total,
      page:     parseInt(page),
      limit:    parseInt(limit)
    });

  } catch (err) {
    console.error('Semua booking error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

// ===== DETAIL BOOKING =====
exports.detailBooking = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM bookings WHERE id = ?', [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Booking tidak ditemukan' });
    }

    res.json({ booking: rows[0] });

  } catch (err) {
    console.error('Detail booking error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

// ===== UPDATE STATUS BOOKING (Admin) =====
exports.updateStatus = async (req, res) => {
  try {
    const { status, mechanic_id } = req.body;
    const validStatus = [
      'Menunggu Konfirmasi', 'Dikonfirmasi',
      'Sedang Dikerjakan', 'Selesai', 'Dibatalkan'
    ];

    if (!validStatus.includes(status)) {
      return res.status(400).json({ message: 'Status tidak valid' });
    }

    await db.query(
      'UPDATE bookings SET status = ?, mechanic_id = ? WHERE id = ?',
      [status, mechanic_id || null, req.params.id]
    );

    res.json({ message: 'Status booking berhasil diupdate' });

  } catch (err) {
    console.error('Update status error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

// ===== HAPUS BOOKING (Admin) =====
exports.hapusBooking = async (req, res) => {
  try {
    await db.query('DELETE FROM bookings WHERE id = ?', [req.params.id]);
    res.json({ message: 'Booking berhasil dihapus' });
  } catch (err) {
    console.error('Hapus booking error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};