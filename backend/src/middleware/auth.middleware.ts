import { NextFunction, Request, Response } from "express";

// Error response structure
interface ErrorResponse {
  success: boolean;
  message: string;
  statusCode: number;
}

// Auth userlogged in
export const auth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session) {
    const error: ErrorResponse = {
      success: false,
      message: "Session does not exist",
      statusCode: 403,
    };
    res.json(error);
    return;
  }
  const { isLogedIn } = req.session.isLogedIn;

  if (isLogedIn === false) {
    const error: ErrorResponse = {
      success: false,
      message: "User is not loggedin",
      statusCode: 400,
    };
    res.json(error);
    return;
  }

  next();
};

// auth user logged out
export const isLoggedOut = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session) {
    const error: ErrorResponse = {
      success: false,
      message: "Session does not exist",
      statusCode: 403,
    };
    res.json(error);
    return;
  }
  res.status(200).json({ message: "User is logged In" });
  next();
};
