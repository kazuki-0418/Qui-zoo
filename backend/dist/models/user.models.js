"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
// get all users
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.user.findMany();
});
// add user
const addUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.user.create({ data }); // add an user
});
// get user by id
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.user.findUnique({
        where: { id }
    });
});
// update user
const updateUser = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const userFound = yield getUserById(id);
    if (!userFound) {
        return null;
    }
    return yield prisma.user.update({
        where: { id },
        data
    });
});
//delete user
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const userFound = yield getUserById(id);
    if (!userFound) {
        return null;
    }
    return prisma.user.delete({
        where: { id }
    });
});
// login user
const userLogin = (username, password) => __awaiter(void 0, void 0, void 0, function* () {
    const userFound = yield prisma.user.findUnique({
        where: { username }
    });
    if (!userFound) {
        return null;
    }
    const comparePassword = yield bcrypt_1.default.compare(userFound.password, password);
    if (comparePassword === false) {
        return false;
    }
    return comparePassword;
});
exports.default = {
    getAllUsers,
    addUser,
    getUserById,
    updateUser,
    deleteUser,
    userLogin,
};
