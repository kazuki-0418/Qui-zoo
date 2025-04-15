import { Router } from "express";
import { LogController } from "../controllers/userActivityLog.controller";

const activityLogRouter = Router();

// create user log
activityLogRouter.post("/create", LogController.createUserActivityLog);

// get user log
activityLogRouter.get("/", LogController.getUserActivityLogById);

// update user log
activityLogRouter.put("/update", LogController.updateUserActivityLog);

export default activityLogRouter;
