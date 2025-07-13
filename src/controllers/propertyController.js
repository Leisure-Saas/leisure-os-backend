// src/controllers/propertyController.js
import prisma from '../prismaClient.js';

// Fungsi untuk membuat properti baru
export const createProperty = async (req, res) => {
  try {
    // Menggunakan Prisma Client untuk menyimpan data ke database
    // req.body sudah berisi semua data yang kita butuhkan
    const newProperty = await prisma.property.create({
      data: req.body,
    });

    // Mengirim kembali data yang baru dibuat sebagai konfirmasi
    res.status(201).json(newProperty);
  } catch (error) {
    // Jika terjadi error, kirim pesan error
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
    const { id } = req.params; // Mengambil ID dari URL
    const property = await prisma.property.findUnique({
      where: { id },
    });

    // Jika properti ditemukan, kirim datanya. Jika tidak, kirim error 404.
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
