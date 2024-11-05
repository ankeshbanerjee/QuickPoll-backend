import { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  profilePic: string;
  fcmTokens: string[];
}
