import prisma from '../prismaClient.js';

// Fungsi untuk membuat booking inquiry baru (dengan cek ketersediaan)
export const createBooking = async (req, res) => {
  try {
    const {
      propertyId,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      totalPrice,
    } = req.body;

    const guestId = req.user.userId;

    const requestedCheckIn = new Date(checkInDate);
    const requestedCheckOut = new Date(checkOutDate);

    const existingBooking = await prisma.booking.findFirst({
      where: {
        propertyId: propertyId,
        status: 'CONFIRMED',
        AND: [
          { checkInDate: { lte: requestedCheckOut } },
          { checkOutDate: { gte: requestedCheckIn } },
        ],
      },
    });

    if (existingBooking) {
      return res.status(409).json({
        error: 'Konflik Jadwal',
        message: 'Properti tidak tersedia pada rentang tanggal yang dipilih.',
      });
    }

    const newBooking = await prisma.booking.create({
      data: {
        propertyId,
        guestId,
        checkInDate: requestedCheckIn,
        checkOutDate: requestedCheckOut,
        numberOfGuests,
        totalPrice,
        status: 'INQUIRY',
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

// =======================================================
// ▼▼▼ FUNGSI BARU UNTUK UPDATE & DELETE BOOKING ▼▼▼
// =======================================================

// Fungsi untuk MEMPERBARUI booking
export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params; // ID booking dari URL
    const userId = req.user.userId; // ID user dari token

    // 1. Cari booking terlebih dahulu
    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking tidak ditemukan.' });
    }

    // 2. Lakukan pengecekan kepemilikan
    if (booking.guestId !== userId) {
      return res.status(403).json({ error: 'Akses Ditolak: Anda bukan pemilik booking ini.' });
    }

    // 3. Jika lolos, lanjutkan proses update
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: req.body,
    });

    res.status(200).json(updatedBooking);
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ error: 'Gagal memperbarui booking.' });
  }
};

// Fungsi untuk MENGHAPUS booking
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params; // ID booking dari URL
    const userId = req.user.userId; // ID user dari token

    // 1. Cari booking terlebih dahulu
    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking tidak ditemukan.' });
    }

    // 2. Lakukan pengecekan kepemilikan
    if (booking.guestId !== userId) {
      return res.status(403).json({ error: 'Akses Ditolak: Anda bukan pemilik booking ini.' });
    }

    // 3. Jika lolos, lanjutkan proses delete
    await prisma.booking.delete({
      where: { id },
    });

    res.status(200).json({ message: 'Booking berhasil dihapus.' });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ error: 'Gagal menghapus booking.' });
  }
};
