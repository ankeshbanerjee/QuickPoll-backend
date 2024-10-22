import { model, Schema, Types } from "mongoose";
import { IPoll } from "../types/IPoll";

const PollSchema = new Schema(
  {
    question: {
      type: String,
      required: true,
    },
    options: [
      {
        text: {
          type: String,
          required: true,
        },
        votedBy: {
          type: [
            {
              type: Types.ObjectId,
              ref: "User",
            },
          ],
          default: [],
        },
      },
    ],
    image: {
      type: String,
      required: false,
    },
    totalVotes: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    expiry: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Poll = model<IPoll>("Poll", PollSchema);
export default Poll;
