import { z } from "zod";
import {
  createUserSchema,
  loginUserSchema,
  fcmTokenSchema,
} from "../validators/user.validator";

export type CreateUserDto = z.infer<typeof createUserSchema>;

export type LoginUserDto = z.infer<typeof loginUserSchema>;

export type FCMTokenDto = z.infer<typeof fcmTokenSchema>;
