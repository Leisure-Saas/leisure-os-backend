// src/services/paymentService.js
import { Xendit } from 'xendit-node';

// Inisialisasi client Xendit dengan kunci rahasia dari environment
const xenditClient = new Xendit({
  secretKey: process.env.XENDIT_SECRET_KEY,
});

// Fungsi untuk membuat invoice pembayaran baru
export const createInvoice = async (booking) => {
  try {
    const { Invoice } = xenditClient;
    const invoiceClient = new Invoice({});

    // Siapkan data untuk invoice
    const invoiceData = {
      externalId: booking.id, // Gunakan ID booking kita sebagai ID eksternal
      amount: booking.totalPrice,
      payerEmail: booking.guest.email,
      description: `Pembayaran untuk booking ${booking.property.name} (#${booking.id})`,
      // URL ini adalah placeholder, bisa diganti nanti dengan URL front-end Anda
      successRedirectUrl: 'https://leisure-os-backend.onrender.com/',
      failureRedirectUrl: 'https://leisure-os-backend.onrender.com/',
    };

    // Kirim permintaan pembuatan invoice ke Xendit
    const response = await invoiceClient.createInvoice({
      data: invoiceData,
    });

    console.log('Invoice berhasil dibuat:', response);
    
    // Kembalikan URL pembayaran untuk diberikan kepada pengguna
    return response.invoiceUrl;

  } catch (error) {
    console.error('Gagal membuat invoice Xendit:', error);
    throw new Error('Gagal memproses pembayaran.');
  }
};
