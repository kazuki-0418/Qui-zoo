"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const quiz_controller_1 = require("../controllers/quiz.controller");
const router = express_1.default.Router();
// TODO All routes require authentication
// Quiz routes
router.get("/", quiz_controller_1.quizController.getAllQuizzes);
router.get("/:id", quiz_controller_1.quizController.getQuizById);
router.post("/", quiz_controller_1.quizController.createQuiz);
router.put("/:id", quiz_controller_1.quizController.updateQuiz);
router.delete("/:id", quiz_controller_1.quizController.deleteQuiz);
exports.default = router;
