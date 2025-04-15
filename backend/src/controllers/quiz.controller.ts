import { Request, Response } from "express";
import { QuizModel } from "../models/quiz.model";
import { Quiz } from "../types/quiz";

const quizModel = new QuizModel();

class QuizController {
  async createQuiz(req: Request<{ null: null }, { null: null }, Quiz>, res: Response) {
    const quiz = req.body;
    try {
      const newQuiz = await quizModel.createQuiz(quiz);
      res.status(201).json(newQuiz);
    } catch (error) {
      console.error("Error creating quiz", error);
      res.status(500).json({ error: "Error creating quiz" });
    }
  }

  async updateQuiz(req: Request<{ id: string }, null, Quiz>, res: Response) {
    const id = req.params.id;
    const quiz = req.body;
    try {
      const updatedQuiz = await quizModel.updateQuiz(id, quiz);
      res.status(200).json(updatedQuiz);
    } catch (error) {
      console.error("Error updating quiz", error);
      res.status(500).json({ error: "Error updating quiz" });
    }
  }

  async getAllQuizzes(_: Request, res: Response) {
    try {
      const quizzes = await quizModel.getAllQuizzes();
      res.status(200).json(quizzes);
    } catch (error) {
      console.error("Error fetching quizzes", error);
      res.status(500).json({ error: "Error fetching quizzes" });
    }
  }

  async getQuizById(req: Request, res: Response) {
    const id = req.params.id;
    try {
      const quiz = await quizModel.getQuizById(id);
      if (quiz) {
        res.status(200).json(quiz);
      } else {
        res.status(404).json({ error: "Quiz not found" });
      }
    } catch (error) {
      console.error("Error fetching quiz", error);
      res.status(500).json({ error: "Error fetching quiz" });
    }
  }

  async deleteQuiz(req: Request, res: Response) {
    const id = req.params.id;
    try {
      const deletedQuiz = await quizModel.deleteQuiz(id);
      res.status(200).json(deletedQuiz);
    } catch (error) {
      console.error("Error deleting quiz", error);
      res.status(500).json({ error: "Error deleting quiz" });
    }
  }
}

export const quizController = new QuizController();
