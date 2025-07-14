// src/controllers/webhookController.js
import prisma from '../prismaClient.js';

export const handleXenditWebhook = async (req, res) => {
  try {
    // Verifikasi Token Callback dari Header
    const callbackToken = req.headers['x-callback-token'];
    if (callbackToken !== process.env.XENDIT_CALLBACK_VERIFICATION_TOKEN) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const webhookData = req.body;
    console.log('Menerima webhook dari Xendit dengan status:', webhookData.status);

    if (webhookData.status === 'PAID' || webhookData.status === 'SETTLED') {
      const bookingId = webhookData.external_id;

      await prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'CONFIRMED' },
      });

      console.log(`Booking dengan ID ${bookingId} telah dikonfirmasi via webhook.`);
    }

    res.status(200).send('Webhook received');

  } catch (error) {
    console.error('Error menangani webhook Xendit:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};
