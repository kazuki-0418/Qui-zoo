import express from "express";
import { LogController } from "../controllers/userActivityLog.controller";
import { auth } from "../middleware/auth.middleware";

const router = express.Router();

// Middleware
router.use(auth);

// create userActivityLog
router.post("/create/:user_id", LogController.createUserActivityLog);

// get userActivityLogs
router.get("/:user_id", LogController.getUserActivityLogsByUserId);

// update userActivityLog
router.put("/update/:id", LogController.updateUserActivityLog);

export default router;
