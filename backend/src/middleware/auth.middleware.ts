import { NextFunction, Request, Response } from "express";

// Error response structure
interface ErrorResponse {
  success: boolean;
  message: string;
  statusCode: number;
}

// Auth user logged in
export const auth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session) {
    const error: ErrorResponse = {
      success: false,
      message: "Session does not exist",
      statusCode: 403,
    };
    res.status(403).json(error);
    return;
  }

  const isLogedIn = req.session.isLogedIn;

  if (isLogedIn === false) {
    const error: ErrorResponse = {
      success: false,
      message: "User is not loggedin",
      statusCode: 401,
    };
    res.status(401).json(error);
    return;
  }

  next();
};
