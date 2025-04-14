"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controlles_1 = __importDefault(require("../controllers/user.controlles"));
// User router instance
const userRouter = (0, express_1.Router)();
// get all Users
userRouter.get("/", user_controlles_1.default.getUsers);
// create user
userRouter.post("/", user_controlles_1.default.addNewUser);
// get user by id
userRouter.get("/:id", user_controlles_1.default.getUserById);
// uppdate user id
userRouter.put("/:id", user_controlles_1.default.updateUserById);
// delete user
userRouter.delete("/:id", user_controlles_1.default.deleteUser);
exports.default = userRouter;
