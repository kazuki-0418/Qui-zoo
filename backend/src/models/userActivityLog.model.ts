import { PrismaClient } from "@prisma/client";
import { activityLogInfo, updateActivityLog } from "../types/userActivityLog";

const prisma = new PrismaClient();

export class UserActivityLog {
  async createActivityLog(activityLog: activityLogInfo) {
    try {
      const email = activityLog.email;
      const user = await prisma.user.findUnique({
        where: { email },
      });
      console.log(user);
      const newActivityLog = await prisma.userActivityLog.create({
        data: {
          id: activityLog.id,
          user: {
            connect: {
              id: user?.id,
            },
          },
          lastActivityDate: new Date().toISOString().split("T")[0],
          questionsAnswered: 0,
          correctAnswers: 0,
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
