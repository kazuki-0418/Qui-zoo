"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quizController = void 0;
const quiz_model_1 = require("../models/quiz.model");
const quizModel = new quiz_model_1.QuizModel();
class QuizController {
    async createQuiz(req, res) {
        const quiz = req.body;
        try {
            const newQuiz = await quizModel.createQuiz(quiz);
            res.status(201).json(newQuiz);
        }
        catch (error) {
            console.error("Error creating quiz", error);
            res.status(500).json({ error: "Error creating quiz" });
        }
    }
    async updateQuiz(req, res) {
        const id = req.params.id;
        const quiz = req.body;
        try {
            const updatedQuiz = await quizModel.updateQuiz(id, quiz);
            res.status(200).json(updatedQuiz);
        }
        catch (error) {
            console.error("Error updating quiz", error);
            res.status(500).json({ error: "Error updating quiz" });
        }
    }
    async getAllQuizzes(_, res) {
        try {
            const quizzes = await quizModel.getAllQuizzes();
            res.status(200).json(quizzes);
        }
        catch (error) {
            console.error("Error fetching quizzes", error);
            res.status(500).json({ error: "Error fetching quizzes" });
        }
    }
    async getQuizById(req, res) {
        const id = req.params.id;
        try {
            const quiz = await quizModel.getQuizById(id);
            if (quiz) {
                res.status(200).json(quiz);
            }
            else {
                res.status(404).json({ error: "Quiz not found" });
            }
        }
        catch (error) {
            console.error("Error fetching quiz", error);
            res.status(500).json({ error: "Error fetching quiz" });
        }
    }
    async deleteQuiz(req, res) {
        const id = req.params.id;
        try {
            const deletedQuiz = await quizModel.deleteQuiz(id);
            res.status(200).json(deletedQuiz);
        }
        catch (error) {
            console.error("Error deleting quiz", error);
            res.status(500).json({ error: "Error deleting quiz" });
        }
    }
}
exports.quizController = new QuizController();
