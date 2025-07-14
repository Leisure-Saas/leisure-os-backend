import prisma from '../prismaClient.js';
import { sendBookingConfirmationEmail } from '../services/mailService.js'; // <-- 1. IMPOR FUNGSI EMAIL

// ... (fungsi createBooking, getAllBookings, getBookingById tetap sama) ...

// Fungsi untuk memperbarui booking (SEKARANG BISA MENGIRIM EMAIL)
export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const { status } = req.body;

    const bookingToUpdate = await prisma.booking.findUnique({
        where: { id }
    });

    if (!bookingToUpdate) {
      return res.status(404).json({ error: "Booking tidak ditemukan." });
    }

    // Otorisasi: hanya tamu yang membuat booking yang bisa mengubahnya
    if (bookingToUpdate.guestId !== userId) {
      return res.status(403).json({ error: "Akses Ditolak: Anda bukan pemilik booking ini." });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status },
      // Penting: Sertakan data guest dan property untuk dikirim ke email
      include: {
        guest: true,
        property: true,
      }
    });

    // ▼▼▼ LOGIKA BARU UNTUK KIRIM EMAIL ▼▼▼
    // Jika status diubah menjadi 'CONFIRMED', panggil fungsi kirim email.
    if (updatedBooking.status === 'CONFIRMED') {
      await sendBookingConfirmationEmail(updatedBooking);
    }

    res.status(200).json(updatedBooking);
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ error: "Gagal memperbarui booking." });
  }
};

// ... (sisa fungsi lainnya seperti createBooking, getAllBookings, deleteBooking) ...
