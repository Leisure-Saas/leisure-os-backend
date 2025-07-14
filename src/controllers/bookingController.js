// src/controllers/bookingController.js

// ... (fungsi createBooking, getAllBookings, getBookingById tetap sama) ...

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
