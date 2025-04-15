import express from "express";
import { questionController } from "../controllers/question.controller";
import { auth } from "../middleware/auth.middleware";
import { sessionExist } from "../middleware/auth.middleware";

const router = express.Router();

// TODO All routes require authentication
router.use(sessionExist);
router.use(auth);

// Quiz routes
router.get("/quiz/:quiz_id", questionController.getAllQuestionsByQuizId);
router.get("/:id", questionController.getQuestionById);
router.post("/", questionController.createQuestion);
router.put("/:id", questionController.updateQuestion);
router.delete("/:id", questionController.deleteQuestion);

export default router;
