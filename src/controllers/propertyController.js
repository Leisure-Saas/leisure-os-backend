// src/controllers/propertyController.js
import prisma from '../prismaClient.js';

// ... (kode fungsi lainnya tetap sama) ...

// Fungsi untuk mendapatkan semua properti (SEKARANG DENGAN PAGINATION)
export const getAllProperties = async (req, res) => {
  try {
    // Ambil query parameter untuk filter dan pagination
    const { location, minGuests, availableFrom, availableTo, page = 1, limit = 10 } = req.query;

    const where = {};
    // ... (logika filter yang sudah ada tetap di sini) ...
    if (location) {
        where.location = { contains: location, mode: 'insensitive' };
    }
    if (minGuests) {
        where.maxGuests = { gte: parseInt(minGuests) };
    }
    if (availableFrom && availableTo) {
        const fromDate = new Date(availableFrom);
        const toDate = new Date(availableTo);
        where.bookings = {
            none: {
                status: 'CONFIRMED',
                AND: [{ checkInDate: { lt: toDate } }, { checkOutDate: { gt: fromDate } }],
            },
        };
    }
    
    // ▼▼▼ LOGIKA BARU UNTUK PAGINATION ▼▼▼
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Jalankan dua query sekaligus: satu untuk mengambil data, satu untuk menghitung total
    const [properties, totalProperties] = await prisma.$transaction([
      prisma.property.findMany({
        where: where,
        skip: skip,
        take: limitNum,
      }),
      prisma.property.count({ where: where })
    ]);
    
    // Kembalikan respons yang terstruktur dengan info pagination
    res.status(200).json({
      properties,
      totalProperties,
      page: pageNum,
      totalPages: Math.ceil(totalProperties / limitNum),
    });

  } catch (error) {
    console.error("Error getting properties:", error);
    res.status(500).json({ error: "Gagal mendapatkan properti." });
  }
};


// --- FUNGSI LAINNYA DI BAWAH INI (createProperty, getPropertyById, dll.) ---
// ... (Salin sisa fungsi dari versi sebelumnya) ...
