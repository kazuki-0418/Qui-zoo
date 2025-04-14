import { PrismaClient } from "@prisma/client";
import { userActivityLog } from "../types/userActivityLog";

const prisma = new PrismaClient();

export class UserActivityLog {
  async createActivityLog(activityLog: Partial<userActivityLog>) {
    try {
      const newActivityLog = await prisma.userActivityLog.create({
        data: {
          id: activityLog.id,
          user: {
            connect: {
              id: activityLog.userId,
            },
          },
          date: new Date(),
          questionsAnswered: 0,
          correctAnswers: 0,
          sessionsJoined: 0,
        },
      });
      return newActivityLog;
    } catch (error) {
      throw new Error(`Error creating question ${error}`);
    }
  }

  async updateActivityLog(id: string, data: Partial<userActivityLog>) {
    try {
      const updateLog = await prisma.userActivityLog.update({
        where: { id },
        data: {
          date: new Date(),
          questionsAnswered: data.questionsAnswered,
          correctAnswers: data.correctAnswers,
          // sessionsJoined: TODO
        },
      });
      return updateLog;
    } catch (error) {
      throw new Error(`Error updating the Activity Log ${error}`);
    }
  }

  async getLogById(id: string) {
    try {
      const log = await prisma.userActivityLog.findUnique({
        where: { id },
      });
      return log;
    } catch (error) {
      throw new Error(`Error getting the log ${error}`);
    }
  }
}
