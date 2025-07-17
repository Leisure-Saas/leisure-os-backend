import { Request, Response } from "express";
import { aiRoutingService } from "../../services/aiRoutingService.js";

export const routeTaskController = async (req: Request, res: Response) => {
    try {
        const { task_type, payload } = req.body;

        if (!task_type || !payload) {
            return res.status(400).json({ message: "task_type and payload are required." });
        }

        const result = await aiRoutingService.handleTask(task_type, payload);
        return res.status(200).json(result);

    } catch (error) {
        console.error("Error in AI task routing:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
