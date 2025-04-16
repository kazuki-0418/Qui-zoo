import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import userModels from "../models/user.models";
import { UserActivityLog } from "../models/userActivityLog.model";

const userLogController = new UserActivityLog();

class userActivityLogController {
  async createUserActivityLog(req: Request, res: Response) {
    try {
      const id = uuidv4();
      const userId: string = req.body.userId;
      const userActivityLogId: string = id;
      const newlog = {
        userId,
        userActivityLogId,
      };
      const { questionsAnswered, correctAnswers } = req.params;
      const questions = {
        questionsAnswered: Number(questionsAnswered),
        correctAnswers: Number(correctAnswers),
      };
      const userLog = await userLogController.createActivityLog(newlog, questions);
      res.status(201).json(userLog);
    } catch (error) {
      console.error("Error creating userLog", error);
      res.status(500).json({ error: "Error creating userLog" });
    }
  }

  async updateUserActivityLog(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = req.params;
      const user = await userModels.getUserById(id);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      const data = {
        questionsAnswered: user?.correctAnswers + user?.wrongAnswers,
        correctAnswers: user.correctAnswers,
      };
      const _logUpdated = await userLogController.updateActivityLog(id, data);
    } catch (error) {
      console.error("Error updating user log", error);
      res.status(500).json({ error: "Error updating user Log" });
    }
  }

  async getUserActivityLogById(
    req: Request<{ userId: string; lastActivityDate: string }>,
    res: Response,
  ) {
    try {
      const { userId, lastActivityDate } = req.params;
      const userLog = await userLogController.getActivityLogsByUserId(userId, lastActivityDate);
      res.status(200).json(userLog);
    } catch (error) {
      console.error("Error updating user log", error);
      res.status(500).json({ error: "Error getting user Log" });
    }
  }
}

export const LogController = new userActivityLogController();
