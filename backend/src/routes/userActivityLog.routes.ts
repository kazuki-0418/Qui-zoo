import { Router } from "express";
import { LogController } from "../controllers/userActivityLog.controller";

const activityLogRouter = Router();

// create userActivityLog
activityLogRouter.post("/create", LogController.createUserActivityLog);

// get userActivityLogs
activityLogRouter.get("/", LogController.getUserActivityLogsById);

// update userActivityLog
activityLogRouter.put("/update", LogController.updateUserActivityLog);

export default activityLogRouter;
