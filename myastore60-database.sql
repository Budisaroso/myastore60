-- =============================================
-- DATABASE: myastore60
-- Sistem Booking Bengkel MyAstore60
-- =============================================

-- Buat & pilih database
CREATE DATABASE IF NOT EXISTS myastore60
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE myastore60;

-- =============================================
-- TABEL 1: users
-- Menyimpan data pelanggan dan admin
-- =============================================
CREATE TABLE IF NOT EXISTS users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  nama       VARCHAR(100)  NOT NULL,
  email      VARCHAR(100)  NOT NULL UNIQUE,
  password   VARCHAR(255)  NOT NULL,
  no_hp      VARCHAR(20)   NOT NULL,
  role       ENUM('admin','user') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =============================================
-- TABEL 2: mechanics
-- Menyimpan data mekanik bengkel
-- =============================================
CREATE TABLE IF NOT EXISTS mechanics (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  nama         VARCHAR(100) NOT NULL,
  spesialisasi VARCHAR(150),
  no_hp        VARCHAR(20),
  is_active    TINYINT(1) DEFAULT 1,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =============================================
-- TABEL 3: services
-- Menyimpan data paket layanan & harga
-- =============================================
CREATE TABLE IF NOT EXISTS services (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  nama_paket   VARCHAR(150) NOT NULL,
  tipe         ENUM('lengkap','satuan') NOT NULL DEFAULT 'satuan',
  harga_normal INT          NOT NULL DEFAULT 0,
  harga_promo  INT          NOT NULL DEFAULT 0,
  jenis_motor  VARCHAR(20)  NOT NULL DEFAULT 'semua',
  cc           VARCHAR(10)  NOT NULL DEFAULT 'semua',
  deskripsi    TEXT,
  is_active    TINYINT(1)   DEFAULT 1,
  created_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =============================================
-- TABEL 4: bookings
-- Menyimpan data booking pelanggan
-- =============================================
CREATE TABLE IF NOT EXISTS bookings (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  nomor_booking    VARCHAR(20)  NOT NULL UNIQUE,
  user_id          INT,
  nama_pelanggan   VARCHAR(100) NOT NULL,
  no_hp            VARCHAR(20)  NOT NULL,
  email            VARCHAR(100),
  merek_kendaraan  VARCHAR(100) NOT NULL,
  nopol            VARCHAR(20)  NOT NULL,
  jenis_motor      VARCHAR(20)  NOT NULL,
  layanan          TEXT         NOT NULL,
  keluhan          TEXT,
  tanggal_servis   DATE         NOT NULL,
  jam_servis       TIME         NOT NULL,
  harga_normal     INT          DEFAULT 0,
  harga_total      INT          DEFAULT 0,
  catatan          TEXT,
  mechanic_id      INT,
  status           ENUM(
                     'Menunggu Konfirmasi',
                     'Dikonfirmasi',
                     'Sedang Dikerjakan',
                     'Selesai',
                     'Dibatalkan'
                   ) NOT NULL DEFAULT 'Menunggu Konfirmasi',
  created_at       TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id)     REFERENCES users(id)     ON DELETE SET NULL,
  FOREIGN KEY (mechanic_id) REFERENCES mechanics(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- =============================================
-- TABEL 5: booking_services
-- Relasi booking dengan paket layanan (many-to-many)
-- =============================================
CREATE TABLE IF NOT EXISTS booking_services (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  booking_id        INT NOT NULL,
  service_id        INT NOT NULL,
  harga_saat_booking INT DEFAULT 0,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =============================================
-- DATA AWAL: Admin default
-- =============================================
INSERT INTO users (nama, email, password, no_hp, role) VALUES
('Admin MyAstore60', 'admin@myastore60.com',
 '$2b$10$placeholder_ganti_dengan_hash_bcrypt', '081234567890', 'admin');

-- =============================================
-- DATA AWAL: Mekanik
-- =============================================
INSERT INTO mechanics (nama, spesialisasi, no_hp) VALUES
('Budi Hartono',  'Mesin & Karburator',    '081111111111'),
('Andi Setiawan', 'CVT & Injeksi Matic',   '082222222222'),
('Rudi Santoso',  'Kelistrikan & Kopling', '083333333333');

-- =============================================
-- DATA AWAL: Paket Servis (dari daftar harga)
-- =============================================
INSERT INTO services (nama_paket, tipe, harga_normal, harga_promo, jenis_motor, cc) VALUES
-- Paket Lengkap Pro
('Paket Service Lengkap Pro', 'lengkap', 250000, 165000, 'bebek',   'besar'),
('Paket Service Lengkap Pro', 'lengkap', 180000, 135000, 'bebek',   'kecil'),
('Paket Service Lengkap Pro', 'lengkap', 250000, 165000, 'matic',   'besar'),
('Paket Service Lengkap Pro', 'lengkap', 180000, 135000, 'matic',   'kecil'),
('Paket Service Lengkap Pro', 'lengkap', 250000, 165000, 'kopling', 'besar'),
('Paket Service Lengkap Pro', 'lengkap', 180000, 135000, 'kopling', 'kecil'),
-- Paket Lengkap Pro Max
('Paket Service Lengkap Pro Max', 'lengkap', 315000, 245000, 'bebek',   'besar'),
('Paket Service Lengkap Pro Max', 'lengkap', 265000, 199000, 'bebek',   'kecil'),
('Paket Service Lengkap Pro Max', 'lengkap', 315000, 245000, 'matic',   'besar'),
('Paket Service Lengkap Pro Max', 'lengkap', 265000, 199000, 'matic',   'kecil'),
('Paket Service Lengkap Pro Max', 'lengkap', 315000, 245000, 'kopling', 'besar'),
('Paket Service Lengkap Pro Max', 'lengkap', 265000, 199000, 'kopling', 'kecil'),
-- Paket Lengkap Biasa
('Paket Service Lengkap', 'lengkap', 180000, 90000, 'bebek',   'besar'),
('Paket Service Lengkap', 'lengkap', 180000, 70000, 'bebek',   'kecil'),
('Paket Service Lengkap', 'lengkap', 180000, 90000, 'matic',   'besar'),
('Paket Service Lengkap', 'lengkap', 120000, 70000, 'matic',   'kecil'),
('Paket Service Lengkap', 'lengkap', 180000, 90000, 'kopling', 'besar'),
('Paket Service Lengkap', 'lengkap', 180000, 70000, 'kopling', 'kecil'),
-- Paket Satuan
('Paket Service Mesin',         'satuan', 95000,  65000, 'bebek',   'besar'),
('Paket Service Mesin',         'satuan', 85000,  50000, 'bebek',   'kecil'),
('Paket Service Mesin',         'satuan', 95000,  65000, 'kopling', 'besar'),
('Paket Service Mesin',         'satuan', 85000,  50000, 'kopling', 'kecil'),
('Paket Service TB/Karbu',      'satuan', 100000, 50000, 'bebek',   'besar'),
('Paket Service TB/Karbu',      'satuan', 95000,  40000, 'bebek',   'kecil'),
('Paket Service TB/Karbu',      'satuan', 100000, 50000, 'kopling', 'besar'),
('Paket Service TB/Karbu',      'satuan', 95000,  40000, 'kopling', 'kecil'),
('Paket Service Kaki-Kaki',     'satuan', 95000,  55000, 'bebek',   'besar'),
('Paket Service Kaki-Kaki',     'satuan', 85000,  40000, 'bebek',   'kecil'),
('Paket Service CVT',           'satuan', 85000,  50000, 'matic',   'besar'),
('Paket Service CVT',           'satuan', 65000,  40000, 'matic',   'kecil'),
('Paket Service Throttle Body', 'satuan', 95000,  65000, 'matic',   'besar'),
('Paket Service Throttle Body', 'satuan', 75000,  50000, 'matic',   'kecil'),
('Paket Infus Injeksi',         'satuan', 85000,  65000, 'matic',   'besar'),
('Paket Infus Injeksi',         'satuan', 65000,  50000, 'matic',   'kecil'),
('Paket Service Kopling',       'satuan', 95000,  55000, 'kopling', 'besar'),
('Paket Service Kopling',       'satuan', 85000,  40000, 'kopling', 'kecil');

-- =============================================
-- CEK HASIL
-- =============================================
SELECT 'Database myastore60 berhasil dibuat!' AS pesan;
SELECT CONCAT('Tabel: ', table_name) AS tabel FROM information_schema.tables
WHERE table_schema = 'myastore60';