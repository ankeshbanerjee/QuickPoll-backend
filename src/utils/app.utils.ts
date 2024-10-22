import { Response } from "express";

export function sendResponse<T>(
  res: Response,
  statusCode: number,
  result: T,
  message: string
) {
  res.status(statusCode).json({
    code: statusCode,
    result,
    success: statusCode >= 200 && statusCode < 300,
    message,
  });
}
