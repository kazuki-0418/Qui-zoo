"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const quiz_controller_1 = require("../controllers/quiz.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const auth_middleware_2 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// TODO All routes require authentication
router.use(auth_middleware_2.sessionExist);
router.use(auth_middleware_1.auth);
// Quiz routes
router.get("/", quiz_controller_1.quizController.getAllQuizzes);
router.get("/:id", quiz_controller_1.quizController.getQuizById);
router.post("/", quiz_controller_1.quizController.createQuiz);
router.put("/:id", quiz_controller_1.quizController.updateQuiz);
router.delete("/:id", quiz_controller_1.quizController.deleteQuiz);
exports.default = router;
