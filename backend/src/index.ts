import { createServer } from "node:http";
import cookieSession from "cookie-session";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import questionRouter from "./routes/question.route";
import quizRouter from "./routes/quiz.route";
import roomRouter from "./routes/room.route";
import userRouter from "./routes/user.routes";
import activityLogRouter from "./routes/userActivityLog.routes";
import { initializeWebSocketServer } from "./websocket";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

const cookieKeyPrimary = process.env.SESSION_SECRET || process.env.COOKIE_S;
const cookieKeySecondary = process.env.COOKIE_E || "defaultKey";

if (!cookieKeyPrimary) {
  throw new Error("Primary cookie key is missing");
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(morgan("dev"));

// CORS preflight
app.options("*", cors());

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    exposedHeaders: ["set-cookie"],
  }),
);

app.use(
  cookieSession({
    name: "session",
    keys: [cookieKeyPrimary, cookieKeySecondary],
    maxAge: Number.parseInt(process.env.COOKIE_MAX_AGE || "86400000"), // 24時間
    secure: process.env.NODE_ENV === "production", // HTTPSの場合はtrue
    httpOnly: true,
    sameSite: "lax",
    domain: process.env.NODE_ENV === "production" ? ".yourdomain.com" : "localhost", // ドメイン設定
    path: "/", // 追加
  }),
);

const server = createServer(app);
initializeWebSocketServer(server);

// Routes
app.use("/api/users", userRouter);
app.use("/api/quizzes", quizRouter);
app.use("/api/questions", questionRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/user_activity_logs", activityLogRouter);

// 404 handler
app.use((_, res) => {
  res.status(404).json({
    success: false,
    message: "Resource not found",
  });
});

// Start server
server.listen(PORT, () => {
  // biome-ignore lint/suspicious/noConsoleLog: <explanation>
  console.log(`Server running on port ${PORT}`);
});

export default app;
