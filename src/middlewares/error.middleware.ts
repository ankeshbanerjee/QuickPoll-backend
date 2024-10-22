import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utils/app.utils";

class ErrorHandler extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
  }
}

const errorMiddleware = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  sendResponse<{}>(
    res,
    err.statusCode || 500,
    {},
    err.message || "Internal Server Error"
  );
};

export default ErrorHandler;
export { errorMiddleware };
