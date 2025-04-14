import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import userModels from "../models/user.models";
import { CreateUser, UpdateUser, User } from "../types/user";

const hashPassword = async (password: string) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    return hashedPassword;
  } catch (error) {
    throw new Error(`Error hashing password: ${error}`);
  }
};

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
const addNewUser = async (req: Request<null, null, CreateUser>, res: Response) => {
  const { username, password, email, role, avatar } = req.body;
  const userFound = await userModels.getUserByEmail(email);

  if (userFound) {
    res.status(500).json({ message: "User already exists" });
    return;
  }

  if (!username || !password || !email) {
    res.status(500).json({ message: "Username, password or email are missing" });
    return;
  }
  if (password.length < 6) {
    res.status(500).json({ message: "Password should be at least 6 characters long" });
    return;
  }

  if (username.length < 3) {
    res.status(500).json({ message: "Username should be at least 3 characters long" });
    return;
  }

  if (email.length < 3) {
    res.status(500).json({ message: "Email should be at least 3 characters long" });
    return;
  }

  if (role !== "STUDENT" && role !== "TEACHER" && role !== "ADMIN") {
    res.status(500).json({ message: "Role should be STUDENT, TEACHER or ADMIN" });
    return;
  }

  if (!avatar) {
    res.status(500).json({ message: "Avatar is required" });
    return;
  }

  const newId = uuidv4();
  const hashpassword = await hashPassword(password);
  const newUser: User = {
    id: newId,
    username: username,
    password: hashpassword,
    email: email,
    role: role,
    avatar: avatar,
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
    res.status(500).json({ message: "User id is required" });
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
const updateUserById = async (req: Request<{ id: string }, null, UpdateUser>, res: Response) => {
  const userFound = await userModels.getUserById(req.params.id);
  if (!userFound) {
    res.status(500).json({ message: "Unable to update user" });
    return;
  }

  const { username, password, email, avatar } = req.body;
  if (password && password.length < 6) {
    res.status(500).json({ message: "Password should be at least 6 characters long" });
    return;
  }
  if (username && username.length < 3) {
    res.status(500).json({ message: "Username should be at least 3 characters long" });
    return;
  }
  if (email && email.length < 3) {
    res.status(500).json({ message: "Email should be at least 3 characters long" });
    return;
  }

  if (avatar && avatar.length < 3) {
    res.status(500).json({ message: "Avatar should be at least 3 characters long" });
    return;
  }

  const hashedPassword = password ? await hashPassword(password) : null;

  const newUser: UpdateUser = {
    username: username || userFound.username,
    password: hashedPassword || userFound.password,
    email: email || userFound.email,
    avatar: avatar || userFound.avatar,
  };
  const updatedUser = await userModels.updateUser(userFound.id, newUser);
  if (!updatedUser) {
    res.status(500).json({ message: "Unable to update user" });
    return;
  }
  res.status(200).json(updatedUser);
};

// delete user
const deleteUser = async (req: Request<{ id: string }>, res: Response) => {
  const userFound = await userModels.getUserById(req.params.id);
  if (!userFound) {
    res.status(500).json({ message: "Unable to delete user" });
    return;
  }
  const user = await userModels.deleteUser(userFound.id);
  if (!user) {
    res.status(500).json({ message: "Unable to delete user" });
    return;
  }
  res.status(200).json(user);
};

// log user in
const logUserIn = async (
  req: Request<null, null, { email: string; password: string }>,
  res: Response,
) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(500).json({ message: "Password or Email missing" });
  }
  const userLogin = await userModels.userLogin(email, password);
  if (!userLogin) {
    res.status(500).json({ mesasge: "Email or Password are incorrect" });
    return;
  }
  if (req.session) {
    req.session.email = email;
    req.session.isLogin = true;
  }
  res.status(200).json({ message: "Login successfully" });
};

// log user out
const logUserOut = async (req: Request, res: Response) => {
  if (req.session) {
    req.session = null;
  }
  res.status(301).json({ message: "User logged out" });
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
