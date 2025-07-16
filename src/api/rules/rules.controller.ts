import { Request, Response } from 'express';
import { aiPricingService } from '../../services/aiPricingService.js';
import { SuggestPriceRequest, SuggestPriceResponse } from './rules.types.js';

// =============================================================
// PENTING: JANGAN HAPUS FUNGSI-FUNGSI DI BAWAH INI
// Ini adalah placeholder agar file routes.ts tidak error.
// Silakan isi kembali dengan logika Anda yang sebelumnya.
// =============================================================

export const createRule = async (req: Request, res: Response) => {
  console.log("Endpoint 'createRule' dipanggil.");
  // TODO: Tambahkan logika Anda untuk membuat rule baru di sini.
  res.status(501).json({ message: 'Create rule endpoint not implemented yet.' });
};

export const getAllRules = async (req: Request, res: Response) => {
  console.log("Endpoint 'getAllRules' dipanggil.");
  // TODO: Tambahkan logika Anda untuk mengambil semua rule di sini.
  res.status(501).json({ message: 'Get all rules endpoint not implemented yet.' });
};


// =============================================================
// HANDLER BARU UNTUK AI PRICE SUGGESTION
// =============================================================

export const suggestPriceHandler = async (req: Request, res: Response) => {
  try {
    // FIX: Menggunakan 'as' untuk memberitahu TypeScript tipe dari req.body
    const input = req.body as SuggestPriceRequest;

    if (!input.propertyId || !input.startDate || !input.endDate) {
      return res.status(400).json({ message: "Missing required fields: propertyId, startDate, endDate" });
    }

    console.log("Controller received request for AI suggestion:", input);

    const suggestionResult = await aiPricingService.getSuggestion({
      propertyId: input.propertyId,
      startDate: new Date(input.startDate),
      endDate: new Date(input.endDate),
      minPrice: input.minPrice,
      maxPrice: input.maxPrice,
    });

    const response: SuggestPriceResponse = {
      suggestedPrice: suggestionResult.suggestedPrice,
      currency: 'USD',
      reasoning: suggestionResult.reasoning,
      confidenceScore: suggestionResult.confidenceScore,
    };

    return res.status(200).json(response);

  } catch (error) {
    console.error("Error in suggestPriceHandler:", error);
    if (error instanceof Error && error.message.includes("minPrice")) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
