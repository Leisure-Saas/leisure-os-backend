// src/controllers/propertyController.js
import prisma from '../prismaClient.js';

// ... (kode fungsi lainnya tetap sama) ...

// Fungsi untuk mendapatkan semua properti (SEKARANG DENGAN FILTER TANGGAL)
export const getAllProperties = async (req, res) => {
  try {
    // 1. Ambil SEMUA query parameter dari URL
    const { location, minGuests, availableFrom, availableTo } = req.query;

    // 2. Siapkan objek 'where' untuk filter Prisma
    const where = {};

    // 3. Bangun objek 'where' secara dinamis
    if (location) {
      where.location = {
        contains: location,
        mode: 'insensitive',
      };
    }

    if (minGuests) {
      where.maxGuests = {
        gte: parseInt(minGuests, 10),
      };
    }

    // ▼▼▼ LOGIKA BARU UNTUK FILTER TANGGAL ▼▼▼
    if (availableFrom && availableTo) {
      // Jika ada filter tanggal, tambahkan kondisi untuk mengecualikan
      // properti yang sudah di-booking pada rentang tanggal tersebut.
      const fromDate = new Date(availableFrom);
      const toDate = new Date(availableTo);

      where.bookings = {
        // 'none' berarti: jangan ikutkan properti yang memiliki booking
        // yang cocok dengan kondisi di dalam ini.
        none: {
          status: 'CONFIRMED', // Hanya periksa booking yang sudah dikonfirmasi
          // Logika tumpang tindih (overlap):
          // Sebuah booking dianggap tumpang tindih jika:
          // Tanggal check-in nya SEBELUM tanggal check-out pencarian, DAN
          // Tanggal check-out nya SETELAH tanggal check-in pencarian.
          AND: [
            { checkInDate: { lt: toDate } },
            { checkOutDate: { gt: fromDate } },
          ],
        },
      };
    }

    // 4. Jalankan query ke database dengan semua filter yang ada
    const properties = await prisma.property.findMany({
      where: where,
    });

    res.status(200).json(properties);
  } catch (error) {
    console.error("Error getting properties:", error);
    res.status(500).json({ error: "Gagal mendapatkan properti." });
  }
};


// --- FUNGSI LAINNYA DI BAWAH INI (createProperty, getPropertyById, dll.) ---
// ... (Salin sisa fungsi dari versi sebelumnya) ...
// Fungsi untuk membuat properti baru (AMAN)
export const createProperty = async (req, res) => {
  try {
    const {
      name,
      type,
      location,
      description,
      bedrooms,
      bathrooms,
      maxGuests,
      basePricePerNight,
    } = req.body;
    const ownerId = req.user.userId;

    const newProperty = await prisma.property.create({
      data: {
        name,
        type,
        location,
        description,
        bedrooms,
        bathrooms,
        maxGuests,
        basePricePerNight,
        owner: { connect: { id: ownerId } },
      },
    });
    res.status(201).json(newProperty);
  } catch (error) {
    console.error("Error creating property:", error);
    res.status(500).json({ error: "Gagal membuat properti." });
  }
};

// Fungsi untuk mendapatkan satu properti berdasarkan ID
export const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await prisma.property.findUnique({ where: { id } });
    if (property) {
      res.status(200).json(property);
    } else {
      res.status(404).json({ error: "Properti tidak ditemukan." });
    }
  } catch (error) {
    console.error("Error getting property:", error);
    res.status(500).json({ error: "Gagal mendapatkan properti." });
  }
};

// Fungsi untuk memperbarui properti (AMAN)
export const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const property = await prisma.property.findUnique({ where: { id } });

    if (!property) {
      return res.status(404).json({ error: "Properti tidak ditemukan." });
    }
    if (property.ownerId !== userId) {
      return res.status(403).json({ error: "Akses Ditolak: Anda bukan pemilik properti ini." });
    }

    const updatedProperty = await prisma.property.update({
      where: { id },
      data: req.body,
    });
    res.status(200).json(updatedProperty);
  } catch (error) {
    console.error("Error updating property:", error);
    res.status(500).json({ error: "Gagal memperbarui properti." });
  }
};

// Fungsi untuk menghapus properti (AMAN)
export const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const property = await prisma.property.findUnique({ where: { id } });

    if (!property) {
      return res.status(404).json({ error: "Properti tidak ditemukan." });
    }
    if (property.ownerId !== userId) {
      return res.status(403).json({ error: "Akses Ditolak: Anda bukan pemilik properti ini." });
    }

    await prisma.property.delete({ where: { id } });
    res.status(200).json({ message: "Properti berhasil dihapus." });
  } catch (error) {
    console.error("Error deleting property:", error);
    res.status(500).json({ error: "Gagal menghapus properti." });
  }
};
