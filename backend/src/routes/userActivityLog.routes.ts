import { Router } from "express";
import { LogController } from "../controllers/userActivityLog.controller";
import { auth, sessionExist } from "../middleware/auth.middleware";

const activityLogRouter = Router();

// Middleware
activityLogRouter.use(sessionExist);
activityLogRouter.use(auth);

// create userActivityLog
activityLogRouter.post("/create", LogController.createUserActivityLog);

// get userActivityLog
activityLogRouter.get("/", LogController.getUserActivityLogById);

// update userActivityLog
activityLogRouter.put("/update", LogController.updateUserActivityLog);

export default activityLogRouter;
