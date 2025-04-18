import express from "express";
import { questionController } from "../controllers/question.controller";
import { auth } from "../middleware/auth.middleware";

const router = express.Router();

// Router authentication
router.use(auth);

// Question routes
router.get("/quiz/:quiz_id", questionController.getAllQuestionsByQuizId);
router.get("/:id", questionController.getQuestionById);
router.post("/", questionController.createQuestion);
router.put("/:id", questionController.updateQuestion);
router.delete("/:id", questionController.deleteQuestion);

export default router;
