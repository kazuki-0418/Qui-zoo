"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
// get all users
const getAllUsers = async () => {
    try {
        const users = await prisma.user.findMany();
        return users;
    }
    catch (error) {
        throw new Error(`Error fetching users: ${error}`);
    }
};
// add user
const addUser = async (data) => {
    try {
        return await prisma.user.create({ data }); // add an user
    }
    catch (error) {
        throw new Error(`Error checking if user exists: ${error}`);
    }
};
// get user by id
const getUserById = async (id) => {
    try {
        const userFound = await prisma.user.findUnique({
            where: { id },
        });
        if (!userFound) {
            return null;
        }
        return userFound;
    }
    catch (error) {
        throw new Error(`Error fetching user by id: ${error}`);
    }
};
const getUserByEmail = async (email) => {
    try {
        const userFound = await prisma.user.findUnique({
            where: { email },
        });
        if (!userFound) {
            return null;
        }
        return userFound;
    }
    catch (error) {
        throw new Error(`Error fetching user by email: ${error}`);
    }
};
// update user
const updateUser = async (id, data) => {
    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                ...data,
                password: data.password,
            },
        });
        return updatedUser;
    }
    catch (error) {
        throw new Error(`Error updating user: ${error}`);
    }
};
//delete user
const deleteUser = async (id) => {
    try {
        const deletedUser = await prisma.user.delete({
            where: { id },
        });
        return deletedUser;
    }
    catch (error) {
        throw new Error(`Error deleting user: ${error}`);
    }
};
// login user
const userLogin = async (email, password) => {
    try {
        const userFound = await prisma.user.findUnique({
            where: { email },
        });
        if (!userFound) {
            return null;
        }
        const comparePassword = await bcrypt_1.default.compare(password, userFound.password);
        if (!comparePassword) {
            return null;
        }
        return comparePassword;
    }
    catch (error) {
        throw new Error(`Error logging in user: ${error}`);
    }
};
exports.default = {
    getAllUsers,
    addUser,
    getUserById,
    getUserByEmail,
    updateUser,
    deleteUser,
    userLogin,
};
