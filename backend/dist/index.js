"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const console_1 = require("console");
dotenv_1.default.config(); // initialize dotenv
// create a new express instance
const app = (0, express_1.default)();
// middleware
app.use((0, cors_1.default)({
    credentials: true
})); // frontend and backend communication
app.use(express_1.default.json()); // alows json post
// cookie keys
const cookie_s = process.env.COOKIE_S;
const cookie_e = process.env.COOKIE_E;
// Close the server if the cookies do not exist
if (!cookie_e || !cookie_s) {
    throw (0, console_1.error)("Cookie keys are missing");
}
// cookies-session
app.use((0, cookie_session_1.default)({
    name: "session",
    maxAge: 7 * 24 * 60 * 60 * 1000, // one week of duration
    keys: [
        cookie_s,
        cookie_e
    ]
}));
// Routes
app.use("/user", user_routes_1.default);
// Fallback
app.use((req, res) => {
    res.status(404).json({ message: "Inexistent Route" });
});
// start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running in ${PORT}`);
});
