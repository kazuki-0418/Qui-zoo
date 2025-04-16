import { PrismaClient } from "@prisma/client";
import { CreateUserActivityLog, UpdateUserActivityLog } from "../types/userActivityLog";

const prisma = new PrismaClient();

export class UserActivityLog {
  async createActivityLog(userId: string, data: CreateUserActivityLog) {
    const today = new Date().toISOString().split("T")[0];

    try {
      const existingLog = await prisma.userActivityLog.findFirst({
        where: {
          user: { id: userId },
          lastActivityDate: today,
        },
      });

      if (existingLog) {
        const updatedLog = await this.updateActivityLog(existingLog.id, {
          questionsAnswered: existingLog.questionsAnswered + data.questionsAnswered,
          correctAnswers: existingLog.correctAnswers + data.correctAnswers,
          sessionsJoined: existingLog.sessionsJoined + 1,
        });
        return updatedLog;
      }

      const newActivityLog = await prisma.userActivityLog.create({
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
          lastActivityDate: today,
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

  async updateActivityLog(id: string, data: UpdateUserActivityLog) {
    try {
      const updateLog = await prisma.userActivityLog.update({
        where: { id },
        data,
      });
      return updateLog;
    } catch (error) {
      throw new Error(`Error updating the Activity Log ${error}`);
    }
  }

  async getActivityLogsByUserId(userId: string) {
    try {
      const log = await prisma.userActivityLog.findMany({
        where: {
          userId,
        },
      });
      return log;
    } catch (error) {
      throw new Error(`Error getting the log ${error}`);
    }
  }
}
