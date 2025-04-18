import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { CreateUser, User } from "../types/user";

const prisma = new PrismaClient();

// get all users
const getAllUsers = async () => {
  try {
    const users = await prisma.user.findMany();
    return users;
  } catch (error) {
    throw new Error(`Error fetching users: ${error}`);
  }
};

// add user
const addUser = async (data: CreateUser) => {
  try {
    const user = await prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    }); // add an user
    return user;
  } catch (error) {
    throw new Error(`Error checking if user exists: ${error}`);
  }
};

// get user by id
const getUserById = async (id: string) => {
  try {
    const userFound = await prisma.user.findUnique({
      where: { id },
    });
    if (!userFound) {
      return null;
    }
    return userFound;
  } catch (error) {
    throw new Error(`Error fetching user by id: ${error}`);
  }
};

const getUserByEmail = async (email: string) => {
  try {
    const userFound = await prisma.user.findUnique({
      where: { email },
    });
    if (!userFound) {
      return null;
    }
    return userFound;
  } catch (error) {
    throw new Error(`Error fetching user by email: ${error}`);
  }
};

// update user
const updateUser = async (id: string, data: Partial<User>) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...data,
        password: data.password,
      },
    });
    return updatedUser;
  } catch (error) {
    throw new Error(`Error updating user: ${error}`);
  }
};

//delete user
const deleteUser = async (id: string) => {
  try {
    const deletedUser = await prisma.user.delete({
      where: { id },
    });
    return deletedUser;
  } catch (error) {
    throw new Error(`Error deleting user: ${error}`);
  }
};

// login user
const userLogin = async (email: string, password: string) => {
  try {
    const userFound = await prisma.user.findUnique({
      where: { email },
    });
    if (!userFound) {
      return null;
    }
    // console.log(userFound.password, password);
    const comparePassword: boolean = await bcrypt.compare(password, userFound.password);
    if (!comparePassword) {
      return null;
    }
    return comparePassword;
  } catch (error) {
    throw new Error(`Error logging in user: ${error}`);
  }
};

export default {
  getAllUsers,
  addUser,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
  userLogin,
};
