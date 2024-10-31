import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import ErrorHandler from "../middlewares/error.middleware";
import { CreatePollDto, VoteUnvotePollDto } from "../dtos/poll.dtos";
import Poll from "../models/poll.model";
import { sendResponse } from "../utils/app.utils";
import { IPoll } from "../types/IPoll";

export async function createPoll(
  req: AuthRequest<{}, {}, CreatePollDto>,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user;
    if (!user) {
      return next(new ErrorHandler(401, "unauthorized"));
    }
    const { question, options } = req.body;
    await Poll.create({
      question,
      options,
      createdBy: user.id,
      expiry: Date.now(),
    });
    sendResponse<{}>(res, 201, {}, "poll created successfully");
  } catch (error) {
    console.log("error in creating poll", error);
    next(error);
  }
}

export async function getPolls(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let polls = await Poll.find()
      .populate("createdBy")
      .populate({
        path: "options",
        populate: {
          path: "votedBy",
          model: "User",
        },
      });
    sendResponse<{ polls: IPoll[] }>(
      res,
      200,
      { polls },
      "polls fetched successfully"
    );
  } catch (error) {
    console.log("error in fetching polls", error);
    next(error);
  }
}

export async function getPollById(
  req: AuthRequest<{}, {}, {}, { id: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.query;
    const poll = await Poll.findById(id)
      .populate("createdBy")
      .populate({
        path: "options",
        populate: {
          path: "votedBy",
          model: "User",
        },
      });
    if (!poll) {
      return next(new ErrorHandler(404, "poll not found"));
    }
    sendResponse<{ poll: IPoll }>(
      res,
      200,
      { poll },
      "poll fetched successfully"
    );
  } catch (error) {
    console.log("error in fetching poll by id", error);
    next(error);
  }
}

export async function getMyPolls(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user!!;
    if (!user) {
      return next(new ErrorHandler(401, "unauthorized"));
    }
    const polls = await Poll.find({ createdBy: { $eq: user.id } })
      .populate("createdBy")
      .populate({
        path: "options",
        populate: {
          path: "votedBy",
          model: "User",
        },
      });
    sendResponse<{ polls: IPoll[] }>(
      res,
      200,
      { polls },
      "polls fetched successfully"
    );
  } catch (error) {
    console.log("error in fetching polls by user", error);
    next(error);
  }
}

export async function votePoll(
  req: AuthRequest<{}, {}, VoteUnvotePollDto>,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user;
    if (!user) {
      return next(new ErrorHandler(401, "unauthorized"));
    }
    const { pollId, option } = req.body;
    const poll = await Poll.findById(pollId);
    if (!poll) {
      return next(new ErrorHandler(404, "poll not found"));
    }
    if (poll.options.length <= option) {
      return next(new ErrorHandler(400, "invalid option's index"));
    }
    if (poll.options.some((it) => it.votedBy.includes(user.id))) {
      return next(new ErrorHandler(400, "user already voted"));
    }
    poll.options[option].votedBy.push(user.id);
    poll.totalVotes += 1;
    await poll.save();
    sendResponse(res, 200, {}, "voted successfully");
  } catch (error) {
    console.log("error in voting poll", error);
    next(error);
  }
}

export async function unvotePoll(
  req: AuthRequest<{}, {}, VoteUnvotePollDto>,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user;
    if (!user) {
      return next(new ErrorHandler(401, "unauthorized"));
    }
    const { pollId, option } = req.body;
    const poll = await Poll.findById(pollId);
    if (!poll) {
      return next(new ErrorHandler(404, "poll not found"));
    }
    if (poll.options.length <= option) {
      return next(new ErrorHandler(400, "invalid option's index"));
    }
    if (!poll.options[option].votedBy.includes(user.id)) {
      return next(new ErrorHandler(400, "user did not vote this option"));
    }
    poll.options[option].votedBy = poll.options[option].votedBy.filter(
      (it) => it.toString() !== user.id.toString()
    );
    poll.totalVotes -= 1;
    await poll.save();
    sendResponse(res, 200, {}, "unvoted successfully");
  } catch (error) {
    console.log("error in unvoting poll", error);
    next(error);
  }
}
