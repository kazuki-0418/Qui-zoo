"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLoggedOut = exports.sessionExist = exports.auth = void 0;
// Auth userlogged in
const auth = (req, res, next) => {
    if (!req.session) {
        const error = {
            success: false,
            message: "Please login",
            statusCode: 403,
        };
        res.json(error);
        return;
    }
    const { isLogedIn } = req.session.isLogedIn;
    if (!isLogedIn) {
        const error = {
            success: false,
            message: "User is not loggedin",
            statusCode: 400,
        };
        res.json(error);
        return;
    }
    next();
};
exports.auth = auth;
// session auth
const sessionExist = (req, res, next) => {
    if (!req.session) {
        const error = {
            success: false,
            message: "Session does not exist",
            statusCode: 403,
        };
        res.json(error);
        return;
    }
    next();
};
exports.sessionExist = sessionExist;
// auth user logged out
const isLoggedOut = (req, res, next) => {
    if (!req.session) {
        const error = {
            success: false,
            message: "Session does not exist",
            statusCode: 403,
        };
        res.json(error);
        return;
    }
    if (!req.session.isLogedin) {
        const error = {
            success: false,
            message: "User is not loged in",
            statusCode: 403,
        };
        res.json(error);
        return;
    }
    res.status(200).json({ message: "User is logged In" });
    next();
};
exports.isLoggedOut = isLoggedOut;
