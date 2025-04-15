import express from "express";
import { quizController } from "../controllers/quiz.controller";
import { auth } from "../middleware/auth.middleware";
import { sessionExist } from "../middleware/auth.middleware";

const router = express.Router();

// TODO All routes require authentication
router.use(sessionExist);
router.use(auth);

// Quiz routes
router.get("/", quizController.getAllQuizzes);
router.get("/:id", quizController.getQuizById);
router.post("/", quizController.createQuiz);
router.put("/:id", quizController.updateQuiz);
router.delete("/:id", quizController.deleteQuiz);

export default router;
