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


// HANDLER DENGAN LOGGING DAN TYPE-SAFETY LENGKAP
export const suggestPriceHandler = async (req: Request, res: Response) => {
  console.log("--- [START] AI Suggestion Request Received ---");

  try {
    console.log("Request Body Received:", JSON.stringify(req.body, null, 2));
    const input = req.body as SuggestPriceRequest;

    if (!input.propertyId || !input.startDate || !input.endDate) {
      console.log("--> Validation FAILED: Missing required fields.");
      return res.status(400).json({ message: "Missing required fields" });
    }
    console.log("--> Validation PASSED.");

    console.log("--> Calling AI Pricing Service...");
    const suggestionResult = await aiPricingService.getSuggestion({
      propertyId: input.propertyId,
      startDate: new Date(input.startDate),
      endDate: new Date(input.endDate),
      minPrice: input.minPrice,
      maxPrice: input.maxPrice,
    });
    console.log("--> AI Service Responded Successfully.");

    const response: SuggestPriceResponse = {
      suggestedPrice: suggestionResult.suggestedPrice,
      currency: 'USD',
      reasoning: suggestionResult.reasoning,
      confidenceScore: suggestionResult.confidenceScore,
    };

    console.log("--- [SUCCESS] Sending 200 OK response to client. ---");
    return res.status(200).json(response);

  } catch (error) {
    // --- BAGIAN YANG DIPERBAIKI ---
    console.error("!!! [CRITICAL ERROR] in suggestPriceHandler:", error);
    
    // Lakukan pengecekan tipe sebelum mengakses .message
    if (error instanceof Error) {
      return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
    
    // Jika bukan object Error, kirim pesan umum
    return res.status(500).json({ message: "An unknown internal server error occurred." });
  }
};
