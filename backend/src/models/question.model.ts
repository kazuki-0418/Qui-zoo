import { PrismaClient } from "@prisma/client";
import { CreateQuestion, UpdateQuestion } from "../types/question";

const prisma = new PrismaClient();

export class QuestionModel {
  async createQuestion(question: CreateQuestion) {
    try {
      const newQuestion = await prisma.question.create({
        data: {
          quizId: question.quizId,
          questionText: question.questionText,
          options: question.options,
          correctOption: question.correctOption,
          points: question.points,
          picture: question.picture ?? " ",
        },
      });
      return newQuestion;
    } catch (error) {
      throw new Error(`Error creating question ${error}`);
    }
  }

  async updateQuestion(id: string, question: UpdateQuestion) {
    try {
      const updatedQuiz = await prisma.question.update({
        where: { id },
        data: {
          questionText: question.questionText,
          options: question.options,
          correctOption: question.correctOption,
          points: question.points,
          picture: question.picture,
        },
      });
      return updatedQuiz;
    } catch (error) {
      throw new Error(`Error updating question ${error}`);
    }
  }

  async getAllQuestionsByQuizId(quizId: string) {
    try {
      const questions = await prisma.question.findMany({
        where: { quizId },
      });
      return questions;
    } catch (error) {
      throw new Error(`Error fetching questions ${error}`);
    }
  }

  async getQuestionById(questionId: string) {
    try {
      const question = await prisma.question.findUnique({
        where: {
          id: questionId,
        },
      });
      return question;
    } catch (error) {
      throw new Error(`Error fetching question ${error}`);
    }
  }

  async deleteQuestion(id: string) {
    try {
      const deletedQuestion = await prisma.question.delete({
        where: { id },
      });
      return deletedQuestion;
    } catch (error) {
      throw new Error(`Error deleting question ${error}`);
    }
  }
}
