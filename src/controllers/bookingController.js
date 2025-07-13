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
      totalPrice,
    } = req.body;

    // TODO: Tambahkan logika untuk memeriksa ketersediaan properti di sini nanti.

    const newBooking = await prisma.booking.create({
      data: {
        propertyId,
        guestId,
        checkInDate: new Date(checkInDate),
        checkOutDate: new Date(checkOutDate),
        numberOfGuests,
        totalPrice,
        status: 'INQUIRY',
      },
    });

    res.status(201).json(newBooking);
  } catch (error)
    {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Gagal membuat booking." });
  }
};

// =======================================================
// ▼▼▼ TAMBAHKAN DUA FUNGSI BARU DI BAWAH INI ▼▼▼
// =======================================================

// Fungsi untuk mendapatkan semua booking
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      // Sertakan data properti dan tamu terkait untuk info lebih lengkap
      include: {
        property: {
          select: { name: true, location: true }
        },
        guest: {
          select: { name: true, email: true }
        }
      }
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
        property: true, // Sertakan semua data properti
        guest: true,    // Sertakan semua data tamu
      }
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
