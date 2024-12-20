import { z } from "zod";

export const createPollSchema = z.object({
  question: z.string(),
  options: z
    .array(
      z.object({
        text: z.string(),
        votedBy: z.array(z.string()).default([]),
      })
    )
    .min(2),
  image: z.string().optional(),
  expiry: z.string(),
});

export const voteUnvotePollSchema = z.object({
  pollId: z.string(),
  option: z.number(),
});
