import { Router } from "express";
import userController from "../controllers/user.controller";
import { auth } from "../middleware/auth.middleware";

// User router instance
const userRouter = Router();

// get all Users
userRouter.get("/", userController.getUsers);

// create user
userRouter.post("/", userController.addNewUser);

// get user by id
userRouter.get("/:id", auth, userController.getUserById); // secure middleware route for api

// update user id
userRouter.put("/:id", auth, userController.updateUserById); // secure middleware route for api

// delete user
userRouter.delete("/:id", auth, userController.deleteUser); // secure middleware route for api

// log user in
userRouter.post("/login", userController.logUserIn); // secure middleware route for api

// log user out
userRouter.post("/logout", auth, userController.logUserOut); // secure middleware route for api

export default userRouter;
