import { NextFunction, Request, Response } from "express";
import { CreateUserDto, LoginUserDto, FCMTokenDto } from "../dtos/user.dtos";
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

export async function updateUser(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      return next(new ErrorHandler(401, "Unauthorized"));
    }
    const userId = req.user._id;
    const updates = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return next(new ErrorHandler(404, "User not found"));
    }

    const allowedUpdates = Array<keyof IUser>("name", "email", "profilePic");
    for (const key in updates) {
      if (allowedUpdates.includes(key as keyof IUser)) {
        (user as any)[key] = updates[key];
      }
    }

    let updatedUser = await user.save();

    sendResponse(
      res,
      200,
      {
        user: updatedUser,
      },
      "User updated successfully"
    );
  } catch (error) {
    next(error);
  }
}

export async function saveFCMToken(
  req: AuthRequest<{}, {}, FCMTokenDto>,
  res: Response,
  next: NextFunction
) {
  try {
    const { token } = req.body;
    const userId = req.user?._id;
    if (!userId) {
      return next(new ErrorHandler(401, "Unauthorized"));
    }
    const user = await User.findById(userId);
    if (!user) {
      return next(new ErrorHandler(404, "User not found"));
    }
    if (!user.fcmTokens.includes(token)) {
      user.fcmTokens.push(token);
      await user.save();
    }
    sendResponse(res, 200, {}, "FCM token saved");
  } catch (error) {
    next(error);
  }
}

export async function deleteFCMToken(
  req: AuthRequest<{}, {}, FCMTokenDto>,
  res: Response,
  next: NextFunction
) {
  try {
    const { token } = req.body;
    const userId = req.user?._id;
    if (!userId) {
      return next(new ErrorHandler(401, "Unauthorized"));
    }
    const user = await User.findById(userId);
    if (!user) {
      return next(new ErrorHandler(404, "User not found"));
    }
    user.fcmTokens = user.fcmTokens.filter((t) => t !== token);
    await user.save();
    sendResponse(res, 200, {}, "FCM token deleted");
  } catch (error) {
    next(error);
  }
}
