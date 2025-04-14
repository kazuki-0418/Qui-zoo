import cookieSession from "cookie-session";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import questionRouter from "./routes/question.route";
import quizRouter from "./routes/quiz.route";
import userRouter from "./routes/user.routes";
import logRouter from "./routes/userActivityLog.routes";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

const cookieKeyPrimary = process.env.COOKIE_S || process.env.SESSION_SECRET;
const cookieKeySecondary = process.env.COOKIE_E;

if (!cookieKeyPrimary) {
  throw new Error("Primary cookie key is missing");
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan("dev"));

// Configure cookie session before CORS
app.use(
  cookieSession({
    name: "session",
    keys: cookieKeySecondary ? [cookieKeyPrimary, cookieKeySecondary] : [cookieKeyPrimary],
    maxAge: Number.parseInt(process.env.COOKIE_MAX_AGE || "86400000"),
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
  }),
);

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    credentials: true,
  }),
);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

// CORS preflight
app.options("*", cors());

// Routes
app.use("/api/users", userRouter);
app.use("/api/quizzes", quizRouter);
app.use("/api/questions", questionRouter);
app.use("/log", logRouter);

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

export default app;
