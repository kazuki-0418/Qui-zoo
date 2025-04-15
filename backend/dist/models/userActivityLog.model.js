"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserActivityLog = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class UserActivityLog {
    async createActivityLog(activityLog) {
        try {
            const newActivityLog = await prisma.userActivityLog.create({
                data: {
                    id: activityLog.id,
                    user: {
                        connect: {
                            id: activityLog.userId,
                        },
                    },
                    lastActivityDate: new Date().toISOString().split('T')[0],
                    questionsAnswered: 0,
                    correctAnswers: 0,
                    sessionsJoined: 0,
                },
            });
            return newActivityLog;
        }
        catch (error) {
            throw new Error(`Error creating question ${error}`);
        }
    }
    async updateActivityLog(id, data) {
        try {
            const updateLog = await prisma.userActivityLog.update({
                where: { id },
                data: {
                    questionsAnswered: data.questionsAnswered,
                    correctAnswers: data.correctAnswers,
                    sessionsJoined: data.sesionsJoined,
                },
            });
            return updateLog;
        }
        catch (error) {
            throw new Error(`Error updating the Activity Log ${error}`);
        }
    }
    async getActivityLogsByUserId(userId) {
        try {
            const log = await prisma.userActivityLog.findUnique({
                where: {
                    userId
                }
            });
            return log;
        }
        catch (error) {
            throw new Error(`Error getting the log ${error}`);
        }
    }
}
exports.UserActivityLog = UserActivityLog;
