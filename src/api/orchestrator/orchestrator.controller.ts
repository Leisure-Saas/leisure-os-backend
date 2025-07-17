import { Request, Response } from "express";

// --- Mock Data (Data Statis untuk Simulasi) ---
const mockActivityFeed = [
    { id: "act-001", status: "Completed", actor: "Axon & Leo", description: "Skrip 'Data Sanitization & Cloning v1.0' selesai.", timestamp: "2025-07-18T01:05:00Z" },
    { id: "act-002", status: "Executing", actor: "Axon", description: "Membangun Backend & Frontend Logic Interface...", timestamp: "2025-07-18T01:15:00Z" },
];

const mockApprovalQueue = [
    { approvalId: "appr-001", type: "PULL_REQUEST", title: "Fitur Smart Check-in Backend", details_url: "https://github.com/..." }
];

// --- Implementasi Controller ---

// 1. Controller untuk mengirim perintah
export const postCommandHandler = async (req: Request, res: Response) => {
    const { command_text } = req.body;
    console.log(`New command received: ${command_text}`);
    // TODO: Logika untuk meneruskan perintah ke Orchestrator ONE
    res.status(202).json({ status: "Command received, processing...", task_id: `task-${Date.now()}` });
};

// 2. Controller untuk mendapatkan Activity Feed
export const getActivityFeedHandler = async (req: Request, res: Response) => {
    // TODO: Nantinya ini akan mengambil data dari database
    res.status(200).json(mockActivityFeed);
};

// 3. Controller untuk mendapatkan Approval Queue
export const getApprovalQueueHandler = async (req: Request, res: Response) => {
    // TODO: Nantinya ini akan mengambil data dari database
    res.status(200).json(mockApprovalQueue);
};

// 4. Controller untuk memproses persetujuan
export const postApprovalHandler = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { decision } = req.body;
    console.log(`Decision '${decision}' recorded for approval ID: ${id}`);
    // TODO: Logika untuk memproses keputusan (misal: trigger deployment)
    res.status(200).json({ status: "Decision recorded" });
};
