// src/controllers/propertyController.js
import prisma from '../prismaClient.js';

// Fungsi untuk membuat properti baru
export const createProperty = async (req, res) => {
  try {
    // Mengambil data dari request body yang dikirim oleh pengguna
    const {
      name,
      type,
      location,
      description,
      bedrooms,
      bathrooms,
      maxGuests,
      basePricePerNight,
      ownerId, // Nanti kita akan buat user owner dulu
    } = req.body;

    // Menggunakan Prisma Client untuk menyimpan data ke database
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
        ownerId,
      },
    });

    // Mengirim kembali data yang baru dibuat sebagai konfirmasi
    res.status(201).json(newProperty);
  } catch (error) {
    // Jika terjadi error, kirim pesan error
    console.error("Error creating property:", error);
    res.status(500).json({ error: "Failed to create property." });
  }
};
