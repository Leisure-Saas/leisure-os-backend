import { Router } from "express";
import { routeTaskController } from "./ai.controller.js";

const aiRouter = Router();

aiRouter.post("/route-task", routeTaskController);

export default aiRouter;
