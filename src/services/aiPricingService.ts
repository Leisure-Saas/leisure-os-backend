interface PriceSuggestionInput {
  propertyId: string;
  startDate: Date;
  endDate: Date;
  // BARU: Tambahkan min/max di input service
  minPrice?: number;
  maxPrice?: number;
}

interface PriceSuggestionOutput {
  suggestedPrice: number;
  reasoning: string;
  confidenceScore: number;
}

class AIPricingService {
  constructor() {
    console.log("AI Pricing Service Initialized (Mock Mode)");
  }

  async getSuggestion(input: PriceSuggestionInput): Promise<PriceSuggestionOutput> {
    console.log(`Generating mock AI suggestion for property ${input.propertyId} with constraints:`, {
      min: input.minPrice,
      max: input.maxPrice,
    });
    
    await new Promise(resolve => setTimeout(resolve, 1500));

    // BARU: Logika mock yang menghormati batasan min/max
    const defaultMin = 100;
    const defaultMax = 500;
    
    const min = input.minPrice || defaultMin;
    const max = input.maxPrice || defaultMax;

    // Pastikan min tidak lebih besar dari max
    if (min > max) {
      throw new Error("minPrice cannot be greater than maxPrice.");
    }

    const suggestedPrice = Math.floor(Math.random() * (max - min + 1) + min);
    
    return {
      suggestedPrice,
      reasoning: `Based on simulated demand. Price constrained between $${min} and $${max}.`,
      confidenceScore: 0.90, // Skor lebih tinggi karena ada batasan
    };
  }
}

export const aiPricingService = new AIPricingService();
