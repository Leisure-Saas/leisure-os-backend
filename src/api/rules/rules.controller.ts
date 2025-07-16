import { Request, Response } from 'express';
// PENTING: Tambahkan .js di akhir path impor untuk modul lokal
import { aiPricingService } from '../../services/aiPricingService.js';
import { SuggestPriceRequest, SuggestPriceResponse } from './rules.types.js';

// ===================================================
// FUNGSI-FUNGSI LAMA ANDA (sebagai placeholder agar tidak error)
// Silakan isi kembali logika Anda di sini jika sebelumnya ada.
// ===================================================

export const createRule = async (req: Request, res: Response) => {
  // TODO: Implement your logic for creating a rule
  res.status(501).json({ message: 'Create rule endpoint not implemented yet.' });
};

export const getAllRules = async (req: Request, res: Response) => {
  // TODO: Implement your logic for getting all rules
  res.status(501).json({ message: 'Get all rules endpoint not implemented yet.' });
};


// ===================================================
// HANDLER BARU UNTUK AI PRICE SUGGESTION
// ===================================================

export const suggestPriceHandler = async (req: Request, res: Response) => {
  try {
    const input: SuggestPriceRequest = req.body;
    if (!input.propertyId || !input.startDate || !input.endDate) {
      return res.status(400).json({ message: "Missing required fields: propertyId, startDate, endDate" });
    }

    console.log("Controller received request for AI suggestion:", input);

    const suggestionResult = await aiPricingService.getSuggestion({
      propertyId: input.propertyId,
      startDate: new Date(input.startDate),
      endDate: new Date(input.endDate),
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
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
