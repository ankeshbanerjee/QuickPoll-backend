import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { IUser } from "../types/IUser";
import ErrorHandler from "./error.middleware";
import User from "../models/user.model";

export interface AuthRequest<
  P = any,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  user?: IUser;
}

const checkAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      const token = req.headers.authorization.split(" ")[1];
      if (!token || token.length === 0) {
        return next(new ErrorHandler(401, "Unauthorized, no token found!"));
      }
      const decodedObj = jwt.verify(token, process.env.JWT_SECRET as string);
      const user = await User.findById((decodedObj as JwtPayload).id);
      if (!user) {
        return next(new ErrorHandler(401, "Unauthorized, user not found"));
      }
      req.user = user;
      next();
    } else {
      return next(
        new ErrorHandler(401, "User not authorized, no token in req.headers")
      );
    }
  } catch (error) {
    console.log("Error in authMiddleware", error);
    return next(new ErrorHandler(401, "Unauthorized, something went wrong!"));
  }
};

export default checkAuth;
