import { Router } from "express";
import { LogController } from "../controllers/userActivityLog.controller";

const logRouter = Router();

// create user log
logRouter.post("/create", LogController.createUserActivityLog);

// get user log
logRouter.get("/", LogController.getLogById);

// update user log
logRouter.put("/update", LogController.updateActivityLog);

export default logRouter;
