import { z } from "zod";
import {
  createPollSchema,
  voteUnvotePollSchema,
} from "../validators/poll.validator";

export type CreatePollDto = z.infer<typeof createPollSchema>;

export type VoteUnvotePollDto = z.infer<typeof voteUnvotePollSchema>;
