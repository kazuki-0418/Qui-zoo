"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLoggedOut = exports.auth = void 0;
// Auth userlogged in 
const auth = (req, res, next) => {
    if (!req.session) {
        const error = {
            success: false,
            message: "Sesion does not exist",
            statusCode: 403
        };
        res.json(error);
        return;
    }
    const { isLogedIn } = req.session.isLogedIn;
    if (!isLogedIn) {
        const error = {
            success: false,
            message: "User is not loggedin",
            statusCode: 400
        };
        res.json(error);
        return;
    }
    next();
};
exports.auth = auth;
// auth user logged out
const isLoggedOut = (req, res, next) => {
    if (!req.session) {
        const error = {
            success: false,
            message: "Session does not exist",
            statusCode: 403
        };
        res.json(error);
        return;
    }
    const { isLogedIn } = req.session.isLogedIn;
    if (isLogedIn) {
        res.status(403).json({ message: "User is logged In" });
        return;
    }
    next();
};
exports.isLoggedOut = isLoggedOut;
