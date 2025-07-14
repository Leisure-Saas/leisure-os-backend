import nodemailer from 'nodemailer';

// Konfigurasi "pengirim email" menggunakan kredensial dari environment
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Fungsi untuk mengirim email konfirmasi booking
export const sendBookingConfirmationEmail = async (booking) => {
  try {
    const mailOptions = {
      from: '"Leisure OS" <noreply@leisure-os.com>',
      to: booking.guest.email, // Mengambil email tamu dari data booking
      subject: `Booking Anda untuk ${booking.property.name} telah dikonfirmasi!`,
      html: `
        <h1>Booking Dikonfirmasi!</h1>
        <p>Halo ${booking.guest.name},</p>
        <p>Booking Anda untuk properti <strong>${booking.property.name}</strong> dari tanggal <strong>${new Date(booking.checkInDate).toLocaleDateString('id-ID')}</strong> hingga <strong>${new Date(booking.checkOutDate).toLocaleDateString('id-ID')}</strong> telah berhasil dikonfirmasi.</p>
        <p>Total Harga: Rp ${booking.totalPrice.toLocaleString('id-ID')}</p>
        <p>Terima kasih telah menggunakan Leisure OS!</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email terkirim: ' + info.messageId);
    // Baris ini sangat penting untuk melihat hasil email di Ethereal
    console.log('URL Preview: ' + nodemailer.getTestMessageUrl(info));

  } catch (error) {
    console.error('Error saat mengirim email:', error);
  }
};
