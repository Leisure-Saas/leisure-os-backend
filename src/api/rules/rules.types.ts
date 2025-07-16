// Data yang kita harapkan dari frontend
export interface SuggestPriceRequest {
  propertyId: string;
  startDate: string; // Format ISO: "2025-12-24"
  endDate: string;   // Format ISO: "2025-12-26"
  // Mungkin nanti kita bisa tambah data lain seperti jumlah tamu, dll.
}

// Data yang akan kita kirim kembali ke frontend
export interface SuggestPriceResponse {
  suggestedPrice: number;
  currency: 'USD'; // atau IDR
  reasoning: string; // Penjelasan singkat dari AI
  confidenceScore: number; // Skor keyakinan AI (0.0 - 1.0)
}
