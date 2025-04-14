import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import userModels from "../models/user.models";

// get all users
const getUsers = async (_: Request, res: Response) => {
  const users = await userModels.getAllUsers();
  if (users.length === 0) {
    res.status(200).json({ message: "No users in the db" });
    return;
  }
  res.status(200).json(users);
};

// add user
const addNewUser = async (req: Request<null, null, Omit<User, "id">>, res: Response) => {
  const newId = uuidv4();
  const hashpassword = await bcrypt.hash(req.body.password, 12);
  const newUser: User = {
    id: newId,
    username: req.body.username,
    password: hashpassword,
    email: req.body.email,
    role: req.body.role,
    avatar: req.body.avatar,
    createdAt: new Date(),
    updatedAt: new Date(),
    correctAnswers: 0,
    wrongAnswers: 0,
    totalParticipations: 0,
  };
  const user = await userModels.addUser(newUser);
  if (!user) {
    res.status(500).json({ message: "Failed to create user" });
  }
  res.status(201).json(user);
};

// get user by id
const getUserById = async (req: Request<{ id: string }>, res: Response) => {
  if (!req.params.id) {
    res.status(500).json({ message: "Unable to fetch user" });
    return;
  }
  const user = await userModels.getUserById(req.params.id);
  if (!user) {
    res.status(500).json({ message: "Unable to find user" });
    return;
  }
  res.status(200).json(user);
};

// update user
const updateUserById = async (req: Request<{ id: string }, null, Partial<User>>, res: Response) => {
  const userFound = await userModels.getUserById(req.params.id);
  if (!userFound) {
    res.status(500).json({ message: "Unable to update user" });
    return;
  }
  const { username, password, email, role, avatar } = req.body;
  const newUser: Partial<User> = {
    username: userFound.username ?? username,
    password: userFound.password ?? password,
    email: userFound.email ?? email,
    role: userFound.role ?? role,
    avatar: userFound.avatar ?? avatar,
    updatedAt: new Date(),
  };
  const updatedUser = await userModels.updateUser(req.params.id, newUser);
  if (!updatedUser) {
    res.status(500).json({ message: "Unable to uppdate user" });
    return;
  }
  res.status(200).json(updatedUser);
};

// delete user
const deleteUser = async (req: Request<{ id: string }>, res: Response) => {
  const id = req.params.id;
  if (!id) {
    res.status(500).json({ mesage: "Unable to delete user" });
  }
  const user = await userModels.deleteUser(id);
  if (!user) {
    res.status(500).json({ message: "Unable to delete user" });
    return;
  }
  res.status(200).json(user);
};

// log user in
const logUserIn = async (
  req: Request<null, null, { username: string; password: string }>,
  res: Response,
) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(500).json({ message: "Password or Username missing" });
  }
  const userLogin = await userModels.userLogin(username, password);
  if (!userLogin) {
    res.status(500).json({ mesasge: "Username or Password are incorrect" });
    return;
  }
  if (req.session) {
    req.session.username = username;
    req.session.isLogin = true;
  }
  res.status(200).json({ message: "Login succesfully" });
};

// log user out
const logUserOut = async (req: Request, res: Response) => {
  if (req.session) {
    req.session = null;
  }
  res.status(301).json({ message: "User loged out" });
};

export default {
  getUsers,
  addNewUser,
  getUserById,
  updateUserById,
  deleteUser,
  logUserIn,
  logUserOut,
};
