"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizModel = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class QuizModel {
    async createQuiz(quiz) {
        try {
            const newQuiz = await prisma.quiz.create({
                data: {
                    title: quiz.title,
                    creatorId: quiz.creatorId,
                    timeLimit: quiz.timeLimit,
                },
            });
            return newQuiz;
        }
        catch (error) {
            throw new Error(`Error creating quiz ${error}`);
        }
    }
    async updateQuiz(id, quiz) {
        try {
            const updatedQuiz = await prisma.quiz.update({
                where: { id },
                data: {
                    title: quiz.title,
                    timeLimit: quiz.timeLimit,
                },
            });
            return updatedQuiz;
        }
        catch (error) {
            throw new Error(`Error updating quiz ${error}`);
        }
    }
    async getAllQuizzes() {
        try {
            const quizzes = await prisma.quiz.findMany();
            return quizzes;
        }
        catch (error) {
            throw new Error(`Error fetching quizzes ${error}`);
        }
    }
    async getQuizById(id) {
        try {
            const quiz = await prisma.quiz.findUnique({
                where: { id },
            });
            return quiz;
        }
        catch (error) {
            throw new Error(`Error fetching quiz ${error}`);
        }
    }
    async deleteQuiz(id) {
        try {
            const deletedQuiz = await prisma.quiz.delete({
                where: { id },
            });
            return deletedQuiz;
        }
        catch (error) {
            throw new Error(`Error deleting quiz ${error}`);
        }
    }
}
exports.QuizModel = QuizModel;
