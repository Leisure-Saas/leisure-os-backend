// Tipe data untuk tugas yang akan datang
type TaskType = "GENERATE_PROPERTY_DESCRIPTION" | "ANALYZE_MARKET_TRENDS" | "ANSWER_GUEST_FAQ" | "CLASSIFY_SUPPORT_TICKET";

// Daftar tugas yang membutuhkan kemampuan tinggi dari Gemini Pro
const PRO_MODEL_TASKS: TaskType[] = [
    "GENERATE_PROPERTY_DESCRIPTION",
    "ANALYZE_MARKET_TRENDS"
];

class AiRoutingService {
    constructor() {
        console.log("AI Routing Engine Service Initialized.");
    }

    /**
     * Menerima tugas, menentukan model yang tepat, dan mendelegasikannya.
     * @param taskType Jenis tugas yang didefinisikan.
     * @param payload Data yang dibutuhkan untuk menyelesaikan tugas.
     * @returns Hasil dari eksekusi model AI.
     */
    public async handleTask(taskType: TaskType, payload: any): Promise<any> {
        console.log(`Routing engine received task: ${taskType}`);

        if (PRO_MODEL_TASKS.includes(taskType)) {
            console.log("Delegating to: Gemini 2.5 Pro");
            // TODO: Hubungkan dengan fungsi pemanggil Gemini Pro yang sebenarnya
            // return await this.callGeminiProAPI(payload);
            return { modelUsed: "Gemini 2.5 Pro", result: `Task ${taskType} completed with payload: ${JSON.stringify(payload)}` };
        } else {
            console.log("Delegating to: Gemini 2.5 Flash");
            // TODO: Hubungkan dengan fungsi pemanggil Gemini Flash yang sebenarnya
            // return await this.callGeminiFlashAPI(payload);
            return { modelUsed: "Gemini 2.5 Flash", result: `Task ${taskType} completed with payload: ${JSON.stringify(payload)}` };
        }
    }

    // private async callGeminiProAPI(payload: any): Promise<any> { ... }
    // private async callGeminiFlashAPI(payload: any): Promise<any> { ... }
}

export const aiRoutingService = new AiRoutingService();
