// src/controllers/bookingController.js
import prisma from '../prismaClient.js';

// Fungsi untuk membuat booking inquiry baru (AMAN)
export const createBooking = async (req, res) => {
  try {
    const {
      propertyId,
      // guestId tidak lagi diambil dari body
      checkInDate,
      checkOutDate,
      numberOfGuests,
      totalPrice,
    } = req.body;

    // Ambil ID user (sebagai guest) dari token yang sudah diverifikasi
    const guestId = req.user.userId;

    // TODO: Tambahkan logika untuk memeriksa ketersediaan properti di sini nanti.

    const newBooking = await prisma.booking.create({
      data: {
        propertyId,
        guestId, // Gunakan guestId dari token
        checkInDate: new Date(checkInDate),
        checkOutDate: new Date(checkOutDate),
        numberOfGuests,
        totalPrice,
        status: 'INQUIRY', // Status default saat dibuat
      },
    });

    res.status(201).json(newBooking);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Gagal membuat booking." });
  }
};

// Fungsi untuk mendapatkan semua booking
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        property: { select: { name: true, location: true } },
        guest: { select: { name: true, email: true } },
      },
    });
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error getting bookings:", error);
    res.status(500).json({ error: "Gagal mendapatkan booking." });
  }
};

// Fungsi untuk mendapatkan satu booking berdasarkan ID
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        property: true,
        guest: true,
      },
    });

    if (booking) {
      res.status(200).json(booking);
    } else {
      res.status(404).json({ error: "Booking tidak ditemukan." });
    }
  } catch (error) {
    console.error("Error getting booking:", error);
    res.status(500).json({ error: "Gagal mendapatkan booking." });
  }
};

// Fungsi untuk memperbarui status booking
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Di masa depan, kita bisa menambahkan validasi peran di sini.
    // Misalnya, hanya OWNER atau ADMIN yang bisa mengubah status menjadi CONFIRMED.

    if (!['INQUIRY', 'CONFIRMED', 'CANCELLED', 'COMPLETED'].includes(status)) {
      return res.status(400).json({ error: "Status tidak valid." });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status },
    });

    res.status(200).json(updatedBooking);
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ error: "Gagal memperbarui status booking." });
  }
};
