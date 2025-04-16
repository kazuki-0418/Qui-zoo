import { PrismaClient } from "@prisma/client";
import { updateActivityLog } from "../types/userActivityLog";

const prisma = new PrismaClient();

export class UserActivityLog {
  async createActivityLog(
    activityLog: { userId: string; userActivityLogId: string },
    data: { questionsAnswered: number; correctAnswers: number },
  ) {
    try {
      const userId = activityLog.userId;
      const newActivityLog = await prisma.userActivityLog.create({
        data: {
          id: activityLog.userActivityLogId,
          user: {
            connect: {
              id: userId,
            },
          },
          lastActivityDate: new Date().toISOString().split("T")[0],
          questionsAnswered: data.questionsAnswered,
          correctAnswers: data.correctAnswers,
          sessionsJoined: 1,
        },
      });
      return newActivityLog;
    } catch (error) {
      throw new Error(`Error creating question ${error}`);
    }
  }

  async updateActivityLog(id: string, data: Partial<updateActivityLog>) {
    try {
      const updateLog: updateActivityLog = await prisma.userActivityLog.update({
        where: { id },
        data: {
          questionsAnswered: data.questionsAnswered,
          correctAnswers: data.correctAnswers,
          sessionsJoined: data.sessionsJoined,
        },
      });
      return updateLog;
    } catch (error) {
      throw new Error(`Error updating the Activity Log ${error}`);
    }
  }

  async getActivityLogsByUserId(userId: string, lastActivityDate: string) {
    try {
      const log = await prisma.userActivityLog.findUnique({
        where: {
          userId,
          lastActivityDate,
        },
      });
      return log;
    } catch (error) {
      throw new Error(`Error getting the log ${error}`);
    }
  }
}
