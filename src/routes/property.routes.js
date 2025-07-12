import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// Endpoint 1: Mengambil semua data properti (READ)
router.get("/", async (req, res) => {
  try {
    const properties = await prisma.property.findMany();
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data properti", error: error.message });
  }
});

// Endpoint 2: Menambahkan properti baru (CREATE)
router.post("/", async (req, res) => {
  const { title, description, price, imageUrl } = req.body;

  if (!title || !description || !price || !imageUrl) {
    return res.status(400).json({ message: "Semua field wajib diisi" });
  }

  try {
    const newProperty = await prisma.property.create({
      data: {
        title: title,
        description: description,
        price: parseInt(price),
        imageUrl: imageUrl,
      },
    });
    res.status(201).json(newProperty);
  } catch (error) {
    res.status(500).json({ message: "Gagal menambahkan properti baru", error: error.message });
  }
});

export default router;
