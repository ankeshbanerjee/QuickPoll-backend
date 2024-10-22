import { NextFunction, Request, Response } from "express";
import { CreateUserDto, LoginUserDto } from "../dtos/user.dtos";
import User from "../models/user.model";
import { sendResponse } from "../utils/app.utils";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.utils";
import { IUser } from "../types/IUser";
import { AuthRequest } from "../middlewares/auth.middleware";
import ErrorHandler from "../middlewares/error.middleware";

export async function registerUser(
  req: Request<{}, {}, CreateUserDto>,
  res: Response,
  next: NextFunction
) {
  try {
    const { name, email, password } = req.body;
    await User.create({ name, email, password });
    sendResponse<{}>(res, 201, {}, "user created successfully");
  } catch (error) {
    console.log("error in creating user", error);
    next(error);
  }
}

export async function loginUser(
  req: Request<{}, {}, LoginUserDto>,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return sendResponse<{}>(res, 401, {}, "invalid email or password");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendResponse<{}>(res, 401, {}, "invalid email or password");
    }
    const token = generateToken(user.id);
    sendResponse<{
      token: string;
    }>(
      res,
      200,
      {
        token,
      },
      "user logged in successfully"
    );
  } catch (error) {
    console.log("error in login user", error);
    next(error);
  }
}

export async function getAuthenticatedUser(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user;
    if (!user) {
      return next(new ErrorHandler(401, "unauthorized"));
    }
    sendResponse<{ user: IUser }>(
      res,
      200,
      { user },
      "user fetched successfully"
    );
  } catch (error) {
    console.log("error in getting authenticated user", error);
    next(error);
  }
}
