import { Request, Response } from "express";
import { UserActivityLog } from "../models/userActivityLog.model";
import {
  CreateUserActivityLog,
  UpdateUserActivityLog,
  getUserActivityLogById,
} from "../types/userActivityLog";
import { UserActivityLog as UserActivityLogType } from "../types/userActivityLog";

const userActivityLogsController = new UserActivityLog();

class userActivityLogController {
  async createUserActivityLog(
    req: Request<{ user_id: string }, null, CreateUserActivityLog>,
    res: Response<
      | UserActivityLogType
      | {
          error: string;
        }
    >,
  ) {
    try {
      const userId: string = req.params.user_id;
      const { questionsAnswered, correctAnswers } = req.body;
      const questions = {
        questionsAnswered,
        correctAnswers,
      };

      const userLog = await userActivityLogsController.createActivityLog(userId, questions);
      res.status(201).json(userLog);
    } catch (error) {
      console.error("Error creating userLog", error);
      res.status(500).json({ error: "Error creating userLog" });
    }
  }

  async updateUserActivityLog(
    req: Request<{ id: string }, null, UpdateUserActivityLog>,
    res: Response<UserActivityLogType | { error: string }>,
  ) {
    try {
      const { id } = req.params;
      const { questionsAnswered, correctAnswers, sessionsJoined } = req.body;

      const data = {
        questionsAnswered,
        correctAnswers,
        sessionsJoined: sessionsJoined + 1,
      };
      const logUpdated = await userActivityLogsController.updateActivityLog(id, data);
      if (!logUpdated) {
        res.status(404).json({ error: "User log not found" });
      }
      res.status(200).json(logUpdated);
    } catch (error) {
      console.error("Error updating user log", error);
      res.status(500).json({ error: "Error updating user Log" });
    }
  }

  async getUserActivityLogsByUserId(
    req: Request<{ user_id: string }, null, getUserActivityLogById>,
    res: Response<UserActivityLogType[] | { error: string }>,
  ) {
    try {
      const { user_id: userId } = req.params;
      const userActivityLogs = await userActivityLogsController.getActivityLogsByUserId(userId);

      if (!userActivityLogs) {
        return res.status(404).json({ error: "User log not found" });
      }
      res.status(200).json(userActivityLogs);
    } catch (error) {
      console.error("Error updating user log", error);
      res.status(500).json({ error: "Error getting user Log" });
    }
  }
}

export const LogController = new userActivityLogController();
