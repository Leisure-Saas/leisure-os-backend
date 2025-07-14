import prisma from '../prismaClient.js';

// Fungsi untuk membuat properti baru (AMAN)
export const createProperty = async (req, res) => {
  try {
    // Ambil data properti dari body request
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

    // Ambil ID pemilik dari token yang sudah diverifikasi oleh middleware
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
        ownerId, // Gunakan ownerId dari token, bukan dari body
      },
    });

    res.status(201).json(newProperty);
  } catch (error) {
    console.error("Error creating property:", error);
    res.status(500).json({ error: "Gagal membuat properti." });
  }
};

// Fungsi untuk mendapatkan semua properti
export const getAllProperties = async (req, res) => {
  try {
    const properties = await prisma.property.findMany();
    res.status(200).json(properties);
  } catch (error) {
    console.error("Error getting properties:", error);
    res.status(500).json({ error: "Gagal mendapatkan properti." });
  }
};

// Fungsi untuk mendapatkan satu properti berdasarkan ID
export const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await prisma.property.findUnique({
      where: { id },
    });

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

// =======================================================
// ▼▼▼ FUNGSI BARU UNTUK UPDATE & DELETE ▼▼▼
// =======================================================

// Fungsi untuk MEMPERBARUI properti
export const updateProperty = async (req, res) => {
  try {
    const { id } = req.params; // ID properti dari URL
    const userId = req.user.userId; // ID user dari token

    // 1. Cari properti terlebih dahulu
    const property = await prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      return res.status(404).json({ error: 'Properti tidak ditemukan.' });
    }

    // 2. LAKUKAN PENGECEKAN KEPEMILIKAN
    if (property.ownerId !== userId) {
      return res.status(403).json({ error: 'Akses Ditolak: Anda bukan pemilik properti ini.' });
    }

    // 3. Jika lolos, lanjutkan proses update
    const updatedProperty = await prisma.property.update({
      where: { id },
      data: req.body, // Update dengan data dari body request
    });

    res.status(200).json(updatedProperty);
  } catch (error) {
    console.error("Error updating property:", error);
    res.status(500).json({ error: 'Gagal memperbarui properti.' });
  }
};

// Fungsi untuk MENGHAPUS properti
export const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params; // ID properti dari URL
    const userId = req.user.userId; // ID user dari token

    // 1. Cari properti terlebih dahulu
    const property = await prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      return res.status(404).json({ error: 'Properti tidak ditemukan.' });
    }

    // 2. LAKUKAN PENGECEKAN KEPEMILIKAN
    if (property.ownerId !== userId) {
      return res.status(403).json({ error: 'Akses Ditolak: Anda bukan pemilik properti ini.' });
    }

    // 3. Jika lolos, lanjutkan proses delete
    await prisma.property.delete({
      where: { id },
    });

    res.status(200).json({ message: 'Properti berhasil dihapus.' });
  } catch (error) {
    console.error("Error deleting property:", error);
    res.status(500).json({ error: 'Gagal menghapus properti.' });
  }
};
