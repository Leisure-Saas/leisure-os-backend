// src/controllers/webhookController.js
import prisma from '../prismaClient.js';

export const handleXenditWebhook = async (req, res) => {
  try {
    // 1. Verifikasi Token Callback dari Header
    const callbackToken = req.headers['x-callback-token'];
    if (callbackToken !== process.env.XENDIT_CALLBACK_VERIFICATION_TOKEN) {
      // Jika token tidak cocok, ini bukan dari Xendit. Tolak.
      return res.status(403).json({ error: 'Forbidden' });
    }

    // 2. Ambil data dari body webhook
    const webhookData = req.body;
    console.log('Menerima webhook dari Xendit:', webhookData);

    // 3. Proses data jika pembayaran berhasil (status 'PAID' atau 'SETTLED')
    if (webhookData.status === 'PAID' || webhookData.status === 'SETTLED') {
      const bookingId = webhookData.external_id; // Ingat, external_id adalah ID booking kita

      // 4. Update status booking di database menjadi 'CONFIRMED'
      await prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'CONFIRMED' },
      });

      console.log(`Booking dengan ID ${bookingId} telah dikonfirmasi.`);
    }

    // 5. Kirim respons 200 OK ke Xendit untuk menandakan webhook diterima
    res.status(200).send('Webhook received');

  } catch (error) {
    console.error('Error menangani webhook Xendit:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};
