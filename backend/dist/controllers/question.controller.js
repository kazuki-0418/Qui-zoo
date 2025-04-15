"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.questionController = void 0;
const question_model_1 = require("../models/question.model");
const questionModel = new question_model_1.QuestionModel();
class QuestionController {
    async createQuestion(req, res) {
        const question = req.body;
        try {
            const newQuiz = await questionModel.createQuestion(question);
            res.status(201).json(newQuiz);
        }
        catch (error) {
            console.error("Error creating question", error);
            res.status(500).json({ error: "Error creating question" });
        }
    }
    async updateQuestion(req, res) {
        const id = req.params.id;
        const question = req.body;
        try {
            const updatedQuiz = await questionModel.updateQuestion(id, question);
            res.status(200).json(updatedQuiz);
        }
        catch (error) {
            console.error("Error updating question", error);
            res.status(500).json({ error: "Error updating question" });
        }
    }
    async getAllQuestionsByQuizId(req, res) {
        const quizId = req.params.quiz_id;
        try {
            const questions = await questionModel.getAllQuestionsByQuizId(quizId);
            res.status(200).json(questions);
        }
        catch (error) {
            console.error("Error fetching questions", error);
            res.status(500).json({ error: "Error fetching questions" });
        }
    }
    async getQuestionById(req, res) {
        const id = req.params.id;
        try {
            const question = await questionModel.getQuestionById(id);
            if (question) {
                res.status(200).json(question);
            }
            else {
                res.status(404).json({ error: "Question not found" });
            }
        }
        catch (error) {
            console.error("Error fetching question", error);
            res.status(500).json({ error: "Error fetching question" });
        }
    }
    async deleteQuestion(req, res) {
        const id = req.params.id;
        try {
            const deletedQuestion = await questionModel.deleteQuestion(id);
            res.status(200).json(deletedQuestion);
        }
        catch (error) {
            console.error("Error deleting question", error);
            res.status(500).json({ error: "Error deleting question" });
        }
    }
}
exports.questionController = new QuestionController();
