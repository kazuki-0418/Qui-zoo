import express from "express";
import { quizController } from "../controllers/quiz.controller";

const router = express.Router();

// TODO All routes require authentication

// Quiz routes
router.get("/", quizController.getAllQuizzes);
router.get("/:id", quizController.getQuizById);
router.post("/", quizController.createQuiz);
router.put("/:id", quizController.updateQuiz);
router.delete("/:id", quizController.deleteQuiz);

export default router;
