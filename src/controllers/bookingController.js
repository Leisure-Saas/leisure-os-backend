// src/controllers/bookingController.js
import prisma from '../prismaClient.js';

// Fungsi untuk membuat booking inquiry baru (DENGAN LOGIKA KETERSEDIAAN)
export const createBooking = async (req, res) => {
  try {
    const {
      propertyId,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      totalPrice,
    } = req.body;

    // Ambil ID user (sebagai guest) dari token yang sudah diverifikasi
    const guestId = req.user.userId;

    // --- ▼▼▼ LOGIKA PENGECEKAN KETERSEDIAAN ▼▼▼ ---

    // 1. Konversi tanggal input menjadi objek Date yang valid
    const requestedCheckIn = new Date(checkInDate);
    const requestedCheckOut = new Date(checkOutDate);

    // 2. Cari booking lain untuk properti yang sama yang sudah dikonfirmasi dan tanggalnya bertindihan
    const existingBooking = await prisma.booking.findFirst({
      where: {
        propertyId: propertyId,
        status: 'CONFIRMED', // Hanya cek booking yang sudah dikonfirmasi
        // Logika untuk menemukan tanggal yang bertindihan:
        // (Tanggal Mulai Booking A <= Tanggal Selesai Booking B) DAN (Tanggal Selesai Booking A >= Tanggal Mulai Booking B)
        AND: [
          {
            checkInDate: {
              lte: requestedCheckOut, // lte = Less Than or Equal (<=)
            },
          },
          {
            checkOutDate: {
              gte: requestedCheckIn, // gte = Greater Than or Equal (>=)
            },
          },
        ],
      },
    });

    // 3. Jika ditemukan booking yang bertindihan, kembalikan error dan jangan lanjutkan
    if (existingBooking) {
      return res.status(409).json({ // 409 Conflict adalah status yang tepat untuk ini
        error: 'Konflik Jadwal',
        message: 'Properti tidak tersedia pada rentang tanggal yang dipilih.',
      });
    }

    // --- ▲▲▲ LOGIKA PENGECEKAN KETERSEDIAAN BERAKHIR ▲▲▲ ---

    // 4. Jika tidak ada konflik, lanjutkan membuat booking baru
    const newBooking = await prisma.booking.create({
      data: {
        propertyId,
        guestId,
        checkInDate: requestedCheckIn,
        checkOutDate: requestedCheckOut,
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
