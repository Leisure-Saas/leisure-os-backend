// src/controllers/propertyController.js
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
