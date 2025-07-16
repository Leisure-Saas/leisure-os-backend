// (import statements tetap sama)
// ...
import { aiPricingService } from '../../services/aiPricingService.js';
import { SuggestPriceRequest, SuggestPriceResponse } from './rules.types.js';

// ... (fungsi placeholder Anda yang lain)

export const suggestPriceHandler = async (req: Request, res: Response) => {
  try {
    const input: SuggestPriceRequest = req.body;
    if (!input.propertyId || !input.startDate || !input.endDate) {
      return res.status(400).json({ message: "Missing required fields: propertyId, startDate, endDate" });
    }

    console.log("Controller received request for AI suggestion:", input);

    // BARU: Teruskan minPrice dan maxPrice ke service
    const suggestionResult = await aiPricingService.getSuggestion({
      propertyId: input.propertyId,
      startDate: new Date(input.startDate),
      endDate: new Date(input.endDate),
      minPrice: input.minPrice, // Akan undefined jika tidak ada, dan itu tidak masalah
      maxPrice: input.maxPrice, // Akan undefined jika tidak ada, dan itu tidak masalah
    });

    const response: SuggestPriceResponse = {
      // ... (sisa respons tetap sama)
      suggestedPrice: suggestionResult.suggestedPrice,
      currency: 'USD',
      reasoning: suggestionResult.reasoning,
      confidenceScore: suggestionResult.confidenceScore,
    };

    return res.status(200).json(response);

  } catch (error) {
    // ... (error handling tetap sama)
    console.error("Error in suggestPriceHandler:", error);
    // Tambahkan penanganan untuk error spesifik dari service
    if (error instanceof Error && error.message.includes("minPrice")) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
