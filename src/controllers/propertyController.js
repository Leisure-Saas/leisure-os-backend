import prisma from '../prismaClient.js';

export const getAllProperties = async (req, res) => {
  try {
    const { location, minGuests, availableFrom, availableTo, page = 1, limit = 10 } = req.query;
    const where = {};
    if (location) where.location = { contains: location, mode: 'insensitive' };
    if (minGuests) where.maxGuests = { gte: parseInt(minGuests) };
    if (availableFrom && availableTo) {
      const fromDate = new Date(availableFrom);
      const toDate = new Date(availableTo);
      where.bookings = {
        none: { status: 'CONFIRMED', AND: [{ checkInDate: { lt: toDate } }, { checkOutDate: { gt: fromDate } }] },
      };
    }
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    const [properties, totalProperties] = await prisma.$transaction([
      prisma.property.findMany({ where, skip, take: limitNum }),
      prisma.property.count({ where })
    ]);
    res.status(200).json({ properties, totalProperties, page: pageNum, totalPages: Math.ceil(totalProperties / limitNum) });
  } catch (error) {
    console.error("Error getting properties:", error);
    res.status(500).json({ error: "Gagal mendapatkan properti." });
  }
};

export const createProperty = async (req, res) => {
  try {
    const ownerId = req.user.userId;
    const newProperty = await prisma.property.create({ data: { ...req.body, ownerId } });
    res.status(201).json(newProperty);
  } catch (error) {
    console.error("Error creating property:", error);
    res.status(500).json({ error: "Gagal membuat properti." });
  }
};

export const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await prisma.property.findUnique({ where: { id } });
    if (property) res.status(200).json(property);
    else res.status(404).json({ error: "Properti tidak ditemukan." });
  } catch (error) {
    console.error("Error getting property:", error);
    res.status(500).json({ error: "Gagal mendapatkan properti." });
  }
};

export const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProperty = await prisma.property.update({ where: { id }, data: req.body });
    res.status(200).json(updatedProperty);
  } catch (error) {
    console.error("Error updating property:", error);
    res.status(500).json({ error: "Gagal memperbarui properti." });
  }
};

export const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.property.delete({ where: { id } });
    res.status(200).json({ message: "Properti berhasil dihapus." });
  } catch (error) {
    console.error("Error deleting property:", error);
    res.status(500).json({ error: "Gagal menghapus properti." });
  }
};
