// src/controllers/bookingController.js
import prisma from '../prismaClient.js';

// Fungsi untuk membuat booking (SEKARANG DENGAN KALKULASI HARGA OTOMATIS)
export const createBooking = async (req, res) => {
  try {
    const {
      propertyId,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      // totalPrice tidak lagi diterima dari client
    } = req.body;

    const guestId = req.user.userId;

    // --- LOGIKA KALKULASI HARGA ---

    // 1. Ambil data properti untuk mendapatkan harga per malam
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return res.status(404).json({ error: 'Properti tidak ditemukan.' });
    }

    // 2. Hitung jumlah malam
    const fromDate = new Date(checkInDate);
    const toDate = new Date(checkOutDate);
    const timeDifference = toDate.getTime() - fromDate.getTime();
    const numberOfNights = Math.ceil(timeDifference / (1000 * 3600 * 24));

    if (numberOfNights <= 0) {
      return res.status(400).json({ error: "Tanggal check-out harus setelah tanggal check-in." });
    }

    // 3. Hitung total harga
    const calculatedTotalPrice = numberOfNights * property.basePricePerNight;

    // --- AKHIR LOGIKA KALKULASI HARGA ---

    // Cek ketersediaan (logika ini tetap sama)
    const existingBooking = await prisma.booking.findFirst({
      where: {
        propertyId,
        status: 'CONFIRMED',
        AND: [
          { checkInDate: { lt: toDate } },
          { checkOutDate: { gt: fromDate } },
        ],
      },
    });

    if (existingBooking) {
      return res.status(409).json({
        error: "Konflik Jadwal",
        message: "Properti tidak tersedia pada rentang tanggal yang dipilih.",
      });
    }

    // Buat booking baru dengan harga yang sudah dihitung server
    const newBooking = await prisma.booking.create({
      data: {
        propertyId,
        guestId,
        checkInDate: fromDate,
        checkOutDate: toDate,
        numberOfGuests,
        totalPrice: calculatedTotalPrice, // Gunakan harga dari server
        status: 'INQUIRY',
      },
    });

    res.status(201).json(newBooking);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Gagal membuat booking." });
  }
};


// --- FUNGSI LAINNYA DI BAWAH INI (getAllBookings, getBookingById, dll) ---
// ... (Salin sisa fungsi dari versi sebelumnya) ...
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

// Fungsi untuk memperbarui booking (AMAN)
export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const bookingToUpdate = await prisma.booking.findUnique({ where: { id } });

    if (!bookingToUpdate) {
      return res.status(404).json({ error: "Booking tidak ditemukan." });
    }

    if (bookingToUpdate.guestId !== userId) {
      return res.status(403).json({ error: "Akses Ditolak: Anda bukan pemilik booking ini." });
    }

    // For now, let's only allow updating status and guests. Price is fixed.
    const { status, numberOfGuests } = req.body;
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status, numberOfGuests },
    });

    res.status(200).json(updatedBooking);
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ error: "Gagal memperbarui booking." });
  }
};

// Fungsi untuk menghapus booking (AMAN)
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const bookingToDelete = await prisma.booking.findUnique({ where: { id } });

    if (!bookingToDelete) {
      return res.status(404).json({ error: "Booking tidak ditemukan." });
    }

    if (bookingToDelete.guestId !== userId) {
      return res.status(403).json({ error: "Akses Ditolak: Anda bukan pemilik booking ini." });
    }

    await prisma.booking.delete({ where: { id } });
    res.status(200).json({ message: "Booking berhasil dihapus." });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ error: "Gagal menghapus booking." });
  }
};
