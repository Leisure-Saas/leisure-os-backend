// src/services/paymentService.js
import { Xendit } from 'xendit-node';

// Inisialisasi client Xendit dengan kunci rahasia dari environment
const xenditClient = new Xendit({
  secretKey: process.env.XENDIT_SECRET_KEY,
});

// Fungsi untuk membuat invoice pembayaran baru
export const createInvoice = async (booking) => {
  try {
    // ▼▼▼ PERBAIKAN DI SINI ▼▼▼
    // Langsung dapatkan service 'Invoice' dari client utama
    const { Invoice } = xenditClient;

    // Siapkan data untuk invoice
    const invoiceData = {
      externalId: booking.id,
      amount: booking.totalPrice,
      payerEmail: booking.guest.email,
      description: `Pembayaran untuk booking ${booking.property.name} (#${booking.id})`,
      successRedirectUrl: 'https://leisure-os-backend.onrender.com/',
      failureRedirectUrl: 'https://leisure-os-backend.onrender.com/',
    };

    // ▼▼▼ DAN PERBAIKAN DI SINI ▼▼▼
    // Kirim permintaan langsung menggunakan 'Invoice', bukan 'invoiceClient'
    const response = await Invoice.createInvoice({
      data: invoiceData,
    });

    console.log('Invoice berhasil dibuat:', response);

    return response.invoiceUrl;

  } catch (error) {
    console.error('Gagal membuat invoice Xendit:', error);
    throw new Error('Gagal memproses pembayaran.');
  }
};
