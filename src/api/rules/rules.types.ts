export interface SuggestPriceRequest {
  propertyId: string;
  startDate: string;
  endDate: string;
  // BARU: Parameter opsional untuk batasan harga
  minPrice?: number;
  maxPrice?: number;
}

export interface SuggestPriceResponse {
  suggestedPrice: number;
  currency: 'USD';
  reasoning: string;
  confidenceScore: number;
}
