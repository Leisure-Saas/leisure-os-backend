import { Router } from "express";
import { 
    postCommandHandler, 
    getActivityFeedHandler, 
    getApprovalQueueHandler, 
    postApprovalHandler 
} from "./orchestrator.controller.js";

const orchestratorRouter = Router();

// Daftarkan semua rute yang dibutuhkan oleh frontend
orchestratorRouter.post("/commands", postCommandHandler);
orchestratorRouter.get("/activity-feed", getActivityFeedHandler);
orchestratorRouter.get("/approval-queue", getApprovalQueueHandler);
orchestratorRouter.post("/approvals/:id", postApprovalHandler);

export default orchestratorRouter;
