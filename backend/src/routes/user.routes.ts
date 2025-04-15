import { Router } from "express";
import userController from "../controllers/user.controlles";
import { auth } from "../middleware/auth.middleware";
import { sessionExist } from "../middleware/auth.middleware";
import { isLoggedOut } from "../middleware/auth.middleware";

// User router instance
const userRouter = Router();

// get all Users
userRouter.get("/", userController.getUsers);

// create user
userRouter.post("/", userController.addNewUser);

// get user by id
userRouter.get("/:id", sessionExist, auth, userController.getUserById); // secure middleware route for api

// update user id
userRouter.put("/:id", sessionExist, auth, userController.updateUserById); // secure middleware route for api

// delete user
userRouter.delete("/:id", sessionExist, auth, userController.deleteUser); // secure middleware route for api

// log user in
userRouter.post("/login", isLoggedOut, userController.logUserIn); // secure middleware route for api

// log user out
userRouter.post("/logout", sessionExist, auth, userController.logUserOut); // secure middleware route for api

export default userRouter;
