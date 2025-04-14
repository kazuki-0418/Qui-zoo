import { Router } from "express";
import userController from "../controllers/user.controlles";

// User router instance
const userRouter = Router()

// get all Users
userRouter.get("/",userController.getUsers)

// create user
userRouter.post("/",userController.addNewUser)

// get user by id
userRouter.get("/:id",userController.getUserById)

// uppdate user id
userRouter.put("/:id",userController.updateUserById)

// delete user
userRouter.delete("/:id",userController.deleteUser)

export default userRouter