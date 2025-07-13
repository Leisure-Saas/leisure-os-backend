// src/controllers/bookingController.js
import prisma from '../prismaClient.js';

// Fungsi untuk membuat booking inquiry baru
export const createBooking = async (req, res) => {
  try {
    const {
      propertyId,
      guestId,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      totalPrice, // Untuk awal, kita asumsikan harga sudah dihitung
    } = req.body;

    // TODO: Tambahkan logika untuk memeriksa ketersediaan properti di sini nanti.

    const newBooking = await prisma.booking.create({
      data: {
        propertyId,
        guestId,
        checkInDate: new Date(checkInDate), // Pastikan format tanggal benar
        checkOutDate: new Date(checkOutDate),
        numberOfGuests,
        totalPrice,
        status: 'INQUIRY', // Status awal saat booking pertama kali dibuat
      },
    });

    res.status(201).json(newBooking);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Gagal membuat booking." });
  }
};
