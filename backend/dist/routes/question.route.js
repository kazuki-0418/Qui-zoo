"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const question_controller_1 = require("../controllers/question.controller");
const router = express_1.default.Router();
// TODO All routes require authentication
// Quiz routes
router.get("/quiz/:quiz_id", question_controller_1.questionController.getAllQuestionsByQuizId);
router.get("/:id", question_controller_1.questionController.getQuestionById);
router.post("/", question_controller_1.questionController.createQuestion);
router.put("/:id", question_controller_1.questionController.updateQuestion);
router.delete("/:id", question_controller_1.questionController.deleteQuestion);
exports.default = router;
