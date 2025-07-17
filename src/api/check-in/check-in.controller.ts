import { Request, Response } from "express";

// ... (fungsi-fungsi lain seperti initiate, uploadId, etc.)

// Fungsi untuk menangani pilihan upselling dari tamu
export const selectUpsellHandler = async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const { selectedOffers } = req.body; // Contoh: ['breakfast', 'airport_pickup']

    try {
        // 1. Validasi sesi check-in
        // 2. Cari harga dari setiap penawaran yang dipilih
        // 3. Tambahkan total biaya penawaran ke tagihan tamu di database
        
        console.log(`Session ${sessionId}: Added offers ${selectedOffers.join(', ')}.`);

        // 4. Kembalikan status sukses
        return res.status(200).json({ message: "Offers added successfully." });

    } catch (error) {
        console.error("Error processing upsell:", error);
        return res.status(500).json({ message: "Failed to add offers." });
    }
};
