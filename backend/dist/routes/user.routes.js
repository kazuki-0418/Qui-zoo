"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controlles_1 = __importDefault(require("../controllers/user.controlles"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const auth_middleware_2 = require("../middleware/auth.middleware");
const auth_middleware_3 = require("../middleware/auth.middleware");
// User router instance
const userRouter = (0, express_1.Router)();
// get all Users
userRouter.get("/", user_controlles_1.default.getUsers);
// create user
userRouter.post("/", user_controlles_1.default.addNewUser);
// get user by id
userRouter.get("/:id", auth_middleware_2.sessionExist, auth_middleware_1.auth, user_controlles_1.default.getUserById); // secure middleware route for api
// update user id
userRouter.put("/:id", auth_middleware_2.sessionExist, auth_middleware_1.auth, user_controlles_1.default.updateUserById); // secure middleware route for api
// delete user
userRouter.delete("/:id", auth_middleware_2.sessionExist, auth_middleware_1.auth, user_controlles_1.default.deleteUser); // secure middleware route for api
// log user in
userRouter.post("/login", auth_middleware_3.isLoggedOut, user_controlles_1.default.logUserIn); // secure middleware route for api
// log user out
userRouter.post("/logout", auth_middleware_2.sessionExist, auth_middleware_1.auth, user_controlles_1.default.logUserOut); // secure middleware route for api
exports.default = userRouter;
