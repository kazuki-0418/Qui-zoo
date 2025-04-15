"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userActivityLog_controller_1 = require("../controllers/userActivityLog.controller");
const activityLogRouter = (0, express_1.Router)();
// create userActivityLog
activityLogRouter.post("/create", userActivityLog_controller_1.LogController.createUserActivityLog);
// get userActivityLog
activityLogRouter.get("/", userActivityLog_controller_1.LogController.getUserActivityLogById);
// update userActivityLog
activityLogRouter.put("/update", userActivityLog_controller_1.LogController.updateUserActivityLog);
exports.default = activityLogRouter;
