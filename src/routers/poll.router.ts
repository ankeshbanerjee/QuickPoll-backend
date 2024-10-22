import { Router } from "express";
import checkAuth from "../middlewares/auth.middleware";
import { validateData } from "../middlewares/validation.middleware";
import {
  createPollSchema,
  voteUnvotePollSchema,
} from "../validators/poll.validator";
import {
  createPoll,
  getPolls,
  getMyPolls,
  getPollById,
  votePoll,
  unvotePoll,
} from "../controllers/poll.controller";

const router = Router();

router.post("/create", checkAuth, validateData(createPollSchema), createPoll);
router.get("/", checkAuth, getPollById);
router.get("/my-polls", checkAuth, getMyPolls);
router.patch("/vote", checkAuth, validateData(voteUnvotePollSchema), votePoll);
router.patch(
  "/unvote",
  checkAuth,
  validateData(voteUnvotePollSchema),
  unvotePoll
);
router.get("/all", checkAuth, getPolls);

export default router;
