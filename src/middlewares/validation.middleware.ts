import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import { sendResponse } from "../utils/app.utils";
import { AuthRequest } from "./auth.middleware";

export function validateData(schema: z.ZodObject<any>) {
  return (req: Request | AuthRequest, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          message: `${issue.path.join(".")} is ${issue.message}`,
        }));
        return sendResponse<{ details: { message: string }[] }>(
          res,
          400,
          { details: errorMessages },
          "Invalid request body"
        );
      } else {
        return next(error);
      }
    }
  };
}
