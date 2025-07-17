import { Request, Response } from 'express';
import { aiPricingService } from '../../services/aiPricingService.js';
import { SuggestPriceRequest, SuggestPriceResponse } from './rules.types.js';

// Fungsi placeholder Anda (tetap sama)
export const createRule = async (req: Request, res: Response) => {
  res.status(501).json({ message: 'Create rule endpoint not implemented yet.' });
};
export const getAllRules = async (req: Request, res: Response) => {
  res.status(501).json({ message: 'Get all rules endpoint not implemented yet.' });
};


// HANDLER DENGAN LOGGING LENGKAP
export const suggestPriceHandler = async (req: Request, res: Response) => {
  // LOG #1: Memastikan request masuk ke handler ini
  console.log("--- [START] AI Suggestion Request Received ---");

  try {
    // LOG #2: Menampilkan isi body yang dikirim oleh frontend
    console.log("Request Body Received:", JSON.stringify(req.body, null, 2));

    const input = req.body as SuggestPriceRequest;

    // LOG #3: Memeriksa validasi input
    if (!input.propertyId || !input.startDate || !input.endDate) {
      console.log("--> Validation FAILED: Missing required fields.");
      return res.status(400).json({ message: "Missing required fields" });
    }
    console.log("--> Validation PASSED.");

    // LOG #4: Tepat sebelum memanggil service AI
    console.log("--> Calling AI Pricing Service...");

    const suggestionResult = await aiPricingService.getSuggestion({
      propertyId: input.propertyId,
      startDate: new Date(input.startDate),
      endDate: new Date(input.endDate),
      minPrice: input.minPrice,
      maxPrice: input.maxPrice,
    });

    // LOG #5: Tepat setelah service AI berhasil merespons
    console.log("--> AI Service Responded Successfully.");

    const response: SuggestPriceResponse = {
      suggestedPrice: suggestionResult.suggestedPrice,
      currency: 'USD',
      reasoning: suggestionResult.reasoning,
      confidenceScore: suggestionResult.confidenceScore,
    };

    // LOG #6: Sebelum mengirim respons sukses ke klien
    console.log("--- [SUCCESS] Sending 200 OK response to client. ---");
    return res.status(200).json(response);

  } catch (error) {
    // LOG #7: Jika ada error yang tertangkap di dalam blok try
    console.error("!!! [CRITICAL ERROR] in suggestPriceHandler:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
