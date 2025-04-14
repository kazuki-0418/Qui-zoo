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
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const user_models_1 = __importDefault(require("../models/user.models"));
// get all users
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_models_1.default.getAllUsers();
    if (users.length === 0) {
        res.status(200).json({ message: "No users in the db" });
        return;
    }
    res.status(200).json(users);
});
// add user
const addNewUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newId = (0, uuid_1.v4)();
    const hashpassword = yield bcrypt_1.default.hash(req.body.password, 12);
    const newUser = {
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
        totalParticipations: 0
    };
    const user = yield user_models_1.default.addUser(newUser);
    if (!user) {
        res.status(500).json({ message: 'Failed to create user' });
    }
    res.status(201).json(user);
});
// get user by id
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params.id) {
        res.status(500).json({ message: "Unable to fetch user" });
        return;
    }
    const user = yield user_models_1.default.getUserById(req.params.id);
    if (!user) {
        res.status(500).json({ message: 'Unable to find user' });
        return;
    }
    res.status(200).json(user);
});
// update user
const updateUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const userFound = yield user_models_1.default.getUserById(req.params.id);
    if (!userFound) {
        res.status(500).json({ message: "Unable to update user" });
        return;
    }
    const { username, password, email, role, avatar } = req.body;
    const newUser = {
        username: (_a = userFound.username) !== null && _a !== void 0 ? _a : username,
        password: (_b = userFound.password) !== null && _b !== void 0 ? _b : password,
        email: (_c = userFound.email) !== null && _c !== void 0 ? _c : email,
        role: (_d = userFound.role) !== null && _d !== void 0 ? _d : role,
        avatar: (_e = userFound.avatar) !== null && _e !== void 0 ? _e : avatar,
        updatedAt: new Date()
    };
    const updatedUser = yield user_models_1.default.updateUser(req.params
        .id, newUser);
    if (!updatedUser) {
        res.status(500).json({ message: "Unable to uppdate user" });
        return;
    }
    res.status(200).json(updatedUser);
});
// delete user
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!id) {
        res.status(500).json({ mesage: "Unable to delete user" });
    }
    const user = yield user_models_1.default.deleteUser(id);
    if (!user) {
        res.status(500).json({ message: "Unable to delete user" });
        return;
    }
    res.status(200).json(user);
});
exports.default = {
    getUsers,
    addNewUser,
    getUserById,
    updateUserById,
    deleteUser
};
