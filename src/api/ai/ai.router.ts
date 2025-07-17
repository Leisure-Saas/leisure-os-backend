import { Router } from "express";
import { routeTaskController } from "./ai.controller";

const aiRouter = Router();

aiRouter.post("/route-task", routeTaskController);

export default aiRouter;
