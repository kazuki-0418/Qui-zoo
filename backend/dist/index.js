"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_session_1 = __importDefault(require("cookie-session"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const firebase_RTDB_config_1 = require("./infrastructure/firebase_RTDB.config");
const question_route_1 = __importDefault(require("./routes/question.route"));
const quiz_route_1 = __importDefault(require("./routes/quiz.route"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const userActivityLog_routes_1 = __importDefault(require("./routes/userActivityLog.routes"));
// Load environment variables
dotenv_1.default.config();
// Create Express app
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const cookieKeyPrimary = process.env.COOKIE_S || process.env.SESSION_SECRET;
const cookieKeySecondary = process.env.COOKIE_E;
if (!cookieKeyPrimary) {
    throw new Error("Primary cookie key is missing");
}
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
// Configure cookie session before CORS
app.use((0, cookie_session_1.default)({
    name: "session",
    keys: cookieKeySecondary ? [cookieKeyPrimary, cookieKeySecondary] : [cookieKeyPrimary],
    maxAge: Number.parseInt(process.env.COOKIE_MAX_AGE || "86400000"),
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
}));
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    credentials: true,
}));
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" },
}));
// CORS preflight
app.options("*", (0, cors_1.default)());
// Routes
app.use("/api/users", user_routes_1.default);
app.use("/api/quizzes", quiz_route_1.default);
app.use("/api/questions", question_route_1.default);
app.use("/api/user_activity_logs", userActivityLog_routes_1.default);
app.use("/api/rooms", (_, res) => {
    const roomsRef = firebase_RTDB_config_1.rtdb.ref("rooms");
    roomsRef
        .once("value")
        .then((snapshot) => {
        if (snapshot.exists()) {
            res.json(snapshot.val());
        }
        else {
            res.status(404).json({ message: "No data available" });
        }
    })
        .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Error fetching data" });
    });
});
// 404 handler
app.use((_, res) => {
    res.status(404).json({
        success: false,
        message: "Resource not found",
    });
});
// Start server
app.listen(PORT, () => {
    // biome-ignore lint/suspicious/noConsoleLog: <explanation>
    console.log(`Server running on port ${PORT}`);
});
exports.default = app;
