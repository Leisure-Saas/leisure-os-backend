import { Router } from "express";
// PERBAIKAN: Tambahkan .js di akhir path import
import { routeTaskController } from "./ai.controller.js";

const aiRouter = Router();

aiRouter.post("/route-task", routeTaskController);

export default aiRouter;
