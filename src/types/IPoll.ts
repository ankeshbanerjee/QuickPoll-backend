import { Document } from "mongoose";

interface PollOption {
  text: string;
  votedBy: string[];
}

export interface IPoll extends Document {
  question: string;
  options: PollOption[];
  image?: string;
  totalVotes: number;
  createdBy: string;
  expiry: Date;
}
