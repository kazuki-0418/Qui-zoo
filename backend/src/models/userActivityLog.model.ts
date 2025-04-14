import { PrismaClient } from "@prisma/client";
import { userActivityLog } from "../types/userActivityLog";

const prisma = new PrismaClient()

export class UserActivityLog {
    async createActivityLog(activityLog: userActivityLog){
        try{
            const newActivityLog  = await prisma.userActivityLog.create({
                data:{
                    id:     activityLog.id,
                    user:  {
                        connect:{
                            id: activityLog.userId
                        }
                    },
                    date: new Date(),
                    questionsAnswered: 0,
                    correctAnswers: 0,
                    sessionsJoined: 0 
                }
            })
            return newActivityLog
        }catch(error){
            throw new Error(`Error creating question ${error}`)
        }
    }
}