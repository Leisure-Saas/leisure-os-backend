import prisma from '../prismaClient.js';

export const handleXenditWebhook = async (req, res) => {
  try {
    // --- MULAI BLOK DEBUG ---
    console.log("--- MEMULAI PROSES DEBUG WEBHOOK ---");
    const receivedToken = req.headers['x-callback-token'];
    const expectedToken = process.env.XENDIT_CALLBACK_VERIFICATION_TOKEN;

    console.log("Token Diterima dari Header Xendit:", receivedToken);
    console.log("Token Diharapkan dari Environment:", expectedToken);
    console.log("Apakah Token Cocok?:", receivedToken === expectedToken); // Akan mencetak true atau false
    console.log("--- AKHIR PROSES DEBUG WEBHOOK ---");
    // --- AKHIR BLOK DEBUG ---

    // Verifikasi Token Callback
    if (receivedToken !== expectedToken) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const webhookData = req.body;
    console.log('Menerima webhook dari Xendit:', webhookData.status);

    if (webhookData.status === 'PAID' || webhookData.status === 'SETTLED') {
      const bookingId = webhookData.external_id;
      await prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'CONFIRMED' },
      });
      console.log(`Booking dengan ID ${bookingId} telah dikonfirmasi.`);
    }

    res.status(200).send('Webhook received');

  } catch (error) {
    console.error('Error menangani webhook Xendit:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};
