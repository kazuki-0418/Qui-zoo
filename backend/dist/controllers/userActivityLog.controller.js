"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogController = void 0;
const uuid_1 = require("uuid");
const user_models_1 = __importDefault(require("../models/user.models"));
const userActivityLog_model_1 = require("../models/userActivityLog.model");
const userLogController = new userActivityLog_model_1.UserActivityLog();
class userActivityLogController {
    async createUserActivityLog(req, res) {
        try {
            const id = (0, uuid_1.v4)();
            const newlog = {
                id,
                user: req.params.userId,
            };
            const userLog = await userLogController.createActivityLog(newlog);
            res.status(201).json(userLog);
        }
        catch (error) {
            console.error("Error creating userLog", error);
            res.status(500).json({ error: "Error creating userLog" });
        }
    }
    async updateUserActivityLog(req, res) {
        try {
            const { id } = req.params;
            const user = await user_models_1.default.getUserById(id);
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            const data = {
                questionsAnswered: user?.correctAnswers + user?.wrongAnswers,
                correctAnswers: user.correctAnswers,
            };
            const _logUpdated = await userLogController.updateActivityLog(id, data);
        }
        catch (error) {
            console.error("Error updating user log", error);
            res.status(500).json({ error: "Error updating user Log" });
        }
    }
    async getUserActivityLogById(req, res) {
        try {
            const { userId } = req.params;
            const userLog = await userLogController.getActivityLogsByUserId(userId);
            res.status(200).json(userLog);
        }
        catch (error) {
            console.error("Error updating user log", error);
            res.status(500).json({ error: "Error getting user Log" });
        }
    }
}
exports.LogController = new userActivityLogController();
