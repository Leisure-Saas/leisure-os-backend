import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  // Ambil token dari header 'Authorization'
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formatnya: "Bearer TOKEN"

  if (token == null) {
    // Jika tidak ada token, kirim error 401 Unauthorized
    return res.status(401).json({ error: "Akses ditolak. Token tidak ditemukan." });
  }

  // Verifikasi token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // Jika token tidak valid (misalnya, sudah expired), kirim error 403 Forbidden
      return res.status(403).json({ error: "Token tidak valid." });
    }
    
    // Jika token valid, simpan informasi user di request dan lanjutkan
    req.user = user;
    next();
  });
};
