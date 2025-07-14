import prisma from '../prismaClient.js';
import { sendBookingConfirmationEmail } from '../services/mailService.js';

// Fungsi ini ADA dan diekspor
export const createBooking = async (req, res) => {
  try {
    const { propertyId, checkInDate, checkOutDate, numberOfGuests } = req.body;
    const guestId = req.user.userId;
    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) return res.status(404).json({ error: 'Properti tidak ditemukan.' });
    const fromDate = new Date(checkInDate);
    const toDate = new Date(checkOutDate);
    const timeDifference = toDate.getTime() - fromDate.getTime();
    const numberOfNights = Math.ceil(timeDifference / (1000 * 3600 * 24));
    if (numberOfNights <= 0) return res.status(400).json({ error: "Tanggal check-out harus setelah tanggal check-in." });
    const calculatedTotalPrice = numberOfNights * property.basePricePerNight;
    const newBooking = await prisma.booking.create({
      data: { propertyId, guestId, checkInDate: fromDate, checkOutDate: toDate, numberOfGuests, totalPrice: calculatedTotalPrice, status: 'INQUIRY' },
    });
    res.status(201).json(newBooking);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Gagal membuat booking." });
  }
};

// Fungsi ini ADA dan diekspor
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({ include: { property: { select: { name: true, location: true } }, guest: { select: { name:true, email: true } } } });
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error getting bookings:", error);
    res.status(500).json({ error: "Gagal mendapatkan booking." });
  }
};

// Fungsi ini ADA dan diekspor
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await prisma.booking.findUnique({ where: { id }, include: { property: true, guest: true } });
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

// Fungsi ini ADA dan diekspor
export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status },
      include: { guest: true, property: true }
    });
    if (updatedBooking.status === 'CONFIRMED') {
      await sendBookingConfirmationEmail(updatedBooking);
    }
    res.status(200).json(updatedBooking);
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ error: "Gagal memperbarui booking." });
  }
};

// Fungsi ini ADA dan diekspor
export const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.booking.delete({ where: { id } });
        res.status(200).json({ message: "Booking berhasil dihapus." });
    } catch (error) {
        console.error("Error deleting booking:", error);
        res.status(500).json({ error: "Gagal menghapus booking." });
    }
};
