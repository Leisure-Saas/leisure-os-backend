import { Request, Response } from 'express';
import { aiPricingService } from '../../services/aiPricingService';
import { SuggestPriceRequest, SuggestPriceResponse } from './rules.types';

// Tambahkan fungsi ini di dalam file controller Anda
export const suggestPriceHandler = async (req: Request, res: Response) => {
  try {
    // 1. Validasi input dari body request
    const input: SuggestPriceRequest = req.body;
    if (!input.propertyId || !input.startDate || !input.endDate) {
      return res.status(400).json({ message: "Missing required fields: propertyId, startDate, endDate" });
    }

    console.log("Controller received request for AI suggestion:", input);

    // 2. Panggil AI Pricing Service dengan data yang sudah di-format
    const suggestionResult = await aiPricingService.getSuggestion({
      propertyId: input.propertyId,
      startDate: new Date(input.startDate),
      endDate: new Date(input.endDate),
    });

    // 3. Format respons sesuai kontrak API kita
    const response: SuggestPriceResponse = {
      suggestedPrice: suggestionResult.suggestedPrice,
      currency: 'USD',
      reasoning: suggestionResult.reasoning,
      confidenceScore: suggestionResult.confidenceScore,
    };

    // 4. Kirim respons sukses
    return res.status(200).json(response);

  } catch (error) {
    console.error("Error in suggestPriceHandler:", error);
    // 5. Kirim respons error jika terjadi masalah
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
