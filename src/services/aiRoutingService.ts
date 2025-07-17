type TaskType = "GENERATE_PROPERTY_DESCRIPTION" | "ANALYZE_MARKET_TRENDS" | "ANSWER_GUEST_FAQ" | "CLASSIFY_SUPPORT_TICKET";

const PRO_MODEL_TASKS: TaskType[] = [
    "GENERATE_PROPERTY_DESCRIPTION",
    "ANALYZE_MARKET_TRENDS"
];

class AiRoutingService {
    constructor() {
        console.log("AI Routing Engine Service Initialized.");
    }

    public async handleTask(taskType: TaskType, payload: any): Promise<any> {
        console.log(`Routing engine received task: ${taskType}`);

        if (PRO_MODEL_TASKS.includes(taskType)) {
            console.log("Delegating to: Gemini 2.5 Pro");
            // TODO: Hubungkan dengan fungsi pemanggil Gemini Pro yang sebenarnya
            return { modelUsed: "Gemini 2.5 Pro", result: `Task ${taskType} completed.` };
        } else {
            console.log("Delegating to: Gemini 2.5 Flash");
            // TODO: Hubungkan dengan fungsi pemanggil Gemini Flash yang sebenarnya
            return { modelUsed: "Gemini 2.5 Flash", result: `Task ${taskType} completed.` };
        }
    }
}

export const aiRoutingService = new AiRoutingService();
