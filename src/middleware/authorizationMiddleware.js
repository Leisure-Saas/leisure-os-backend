import prisma from '../prismaClient.js';

// Middleware ini akan menerima daftar peran yang diizinkan
export const authorize = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      // Kita asumsikan middleware authenticateToken sudah berjalan sebelumnya,
      // sehingga kita memiliki req.user
      const userRole = req.user.role;

      // 1. Cek apakah peran user ada di dalam daftar yang diizinkan
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ error: "Akses Ditolak: Anda tidak memiliki hak akses untuk sumber daya ini." });
      }

      // Jika peran diizinkan, lanjutkan ke proses berikutnya
      next();

    } catch (error) {
      res.status(500).json({ error: "Terjadi kesalahan pada server saat otorisasi." });
    }
  };
};
