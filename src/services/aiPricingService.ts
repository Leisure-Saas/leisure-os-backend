import { VertexAI, HarmCategory, HarmBlockThreshold } from '@google-cloud/vertexai'; // 1. IMPOR ENUM DI SINI

// Inisialisasi Klien Vertex AI (kode ini tetap sama)
const authOptions = process.env.GOOGLE_CREDENTIALS_JSON
    ? { credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON) }
    : {};

const vertex_ai = new VertexAI({
    project: process.env.GOOGLE_PROJECT_ID || 'the-luxury-leisure',
    location: 'us-central1',
    ...authOptions
});

const model = 'gemini-1.5-flash-001';

// 2. GUNAKAN ENUM DI SAFETY SETTINGS
const generativeModel = vertex_ai.preview.getGenerativeModel({
    model: model,
    generationConfig: {
        'maxOutputTokens': 2048,
        'temperature': 0.5,
        'topP': 1,
    },
    safetySettings: [ // <-- BAGIAN YANG DIPERBAIKI
        { 'category': HarmCategory.HARM_CATEGORY_HATE_SPEECH, 'threshold': HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { 'category': HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, 'threshold': HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { 'category': HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, 'threshold': HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { 'category': HarmCategory.HARM_CATEGORY_HARASSMENT, 'threshold': HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE }
    ],
});

// --- Definisi Tipe Data (tetap sama) ---
interface PriceSuggestionInput {
  propertyId: string;
  startDate: Date;
  endDate: Date;
  minPrice?: number;
  maxPrice?: number;
}

interface PriceSuggestionOutput {
  suggestedPrice: number;
  reasoning: string;
  confidenceScore: number;
}

// --- Class Service (logika prompt & pemanggilan tetap sama) ---
class AIPricingService {
  constructor() {
    console.log("AI Pricing Service Initialized (REAL AI MODE - Google Gemini)");
  }

  async getSuggestion(input: PriceSuggestionInput): Promise<PriceSuggestionOutput> {
    console.log(`Generating REAL Gemini suggestion for property ${input.propertyId}`);

    const prompt = `
      You are an expert hospitality pricing strategist for a platform called Leisure OS.
      A host wants a price suggestion for a property with the following details:
      - Property ID: ${input.propertyId}
      - Check-in Date: ${input.startDate.toISOString().split('T')[0]}
      - Check-out Date: ${input.endDate.toISOString().split('T')[0]}
      - Host's desired price range: between $${input.minPrice || 'not set'} and $${input.maxPrice || 'not set'}.

      Analyze market data, local events, and seasonality for these dates. 
      Provide an optimal nightly price. The final price MUST be within the host's desired range if provided.

      Respond ONLY with a valid JSON object in the following format, with no other text or markdown:
      {
        "suggestedPrice": <number>,
        "reasoning": "<string, a short explanation for your pricing>",
        "confidenceScore": <number, between 0.0 and 1.0>
      }
    `;

    const req = { contents: [{ role: 'user', parts: [{ text: prompt }] }] };
    const result = await generativeModel.generateContent(req);
    
    const responseText = result.response.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!responseText) {
      throw new Error("Gemini did not return a valid response.");
    }

    const resultJson = JSON.parse(responseText) as PriceSuggestionOutput;
    return resultJson;
  }
}

export const aiPricingService = new AIPricingService();
