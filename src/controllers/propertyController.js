import prisma from '../prismaClient.js';
import AppError from '../utils/appError.js'; // Impor AppError

// Semua fungsi sekarang menerima 'next' sebagai argumen ketiga
export const getAllProperties = async (req, res, next) => {
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
    
    // Standarisasi respons sukses
    res.status(200).json({
      status: 'success',
      data: {
        properties,
        totalProperties,
        page: pageNum,
        totalPages: Math.ceil(totalProperties / limitNum),
      }
    });
  } catch (error) {
    next(error); // Pola error handling baru
  }
};

export const getPropertyById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const property = await prisma.property.findUnique({ where: { id } });

    if (!property) {
      // Pola error handling baru untuk "Not Found"
      return next(new AppError('Properti dengan ID tersebut tidak ditemukan.', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { property }
    });
  } catch (error) {
    next(error); // Pola error handling baru
  }
};

export const createProperty = async (req, res, next) => {
  try {
    const ownerId = req.user.userId;
    const newProperty = await prisma.property.create({ data: { ...req.body, ownerId } });
    
    res.status(201).json({
      status: 'success',
      data: { property: newProperty }
    });
  } catch (error) {
    next(error); // Pola error handling baru
  }
};

export const updateProperty = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Cek kepemilikan sudah dilakukan di middleware 'authorize'
    const updatedProperty = await prisma.property.update({ where: { id }, data: req.body });
    
    res.status(200).json({
      status: 'success',
      data: { property: updatedProperty }
    });
  } catch (error) {
    next(error); // Pola error handling baru
  }
};

export const deleteProperty = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Cek kepemilikan sudah dilakukan di middleware 'authorize'
    await prisma.property.delete({ where: { id } });
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error); // Pola error handling baru
  }
};
