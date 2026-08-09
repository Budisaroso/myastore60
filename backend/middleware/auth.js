// middleware/auth.js — Verifikasi JWT Token
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const header = req.headers['authorization'];
  const token  = header && header.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'Akses ditolak, token tidak ada' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Token tidak valid atau sudah expired' });
  }
};