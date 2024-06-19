// pollController.js

import asyncHandler from "express-async-handler";
import Poll from "../models/pollModel.js";
import Vote from "../models/voteModel.js";

const createPoll = asyncHandler(async (req, res) => {
  const { title, options, duration } = req.body;

  const currentTime = new Date();
  const expirationDate = new Date(currentTime.getTime() + duration * 60000);

  const poll = await Poll.create({
    title,
    options,
    creator: req.user._id,
    duration,
    expiresAt: expirationDate,
  });

  res.status(201).json(poll);
});

// Controller to fetch all polls
const getPolls = asyncHandler(async (req, res) => {
  const polls = await Poll.find().populate("creator", "name");
  res.json(polls);
});

// Controller to fetch a poll by ID
const getPollById = asyncHandler(async (req, res) => {
  const poll = await Poll.findById(req.params.id);

  if (poll) {
    res.json(poll);
  } else {
    res.status(404);
    throw new Error("Poll not found");
  }
});

// Controller to update a poll
const updatePoll = asyncHandler(async (req, res) => {
  const poll = await Poll.findById(req.params.id);

  if (poll) {
    // Check if the current user is the creator of the poll or an admin
    if (
      poll.creator.toString() !== req.user._id.toString() &&
      req.user.role !== "ADMIN"
    ) {
      res.status(401);
      throw new Error("Not authorized to update this poll");
    }

    poll.title = req.body.title || poll.title;
    poll.options = req.body.options || poll.options;

    const updatedPoll = await poll.save();
    res.json(updatedPoll);
  } else {
    res.status(404);
    throw new Error("Poll not found");
  }
});

// Controller to delete a poll
const deletePoll = asyncHandler(async (req, res) => {
  const poll = await Poll.findById(req.params.id);

  if (poll) {
    // Check if the current user is the creator of the poll or an admin
    if (
      poll.creator.toString() !== req.user._id.toString() &&
      req.user.role !== "ADMIN"
    ) {
      res.status(401);
      throw new Error("Not authorized to delete this poll");
    }

    await poll.remove();
    res.json({ message: "Poll removed" });
  } else {
    res.status(404);
    throw new Error("Poll not found");
  }
});

// Controller to get poll results after it expires
const getPollResults = asyncHandler(async (req, res) => {
  const pollId = req.params.id;

  // Find the poll by ID
  const poll = await Poll.findById(pollId);
  if (!poll) {
    res.status(404);
    throw new Error("Poll not found");
  }

  const now = new Date();
  if (poll.expiresAt > now) {
    res.status(400);
    throw new Error("Poll has not yet expired");
  }

  const votes = await Vote.find({ poll: pollId });

  const result = {};
  poll.options.forEach((option) => {
    result[option] = votes.filter((vote) => vote.option === option).length;
  });

  res.json(result);
});

const getPollDetails = asyncHandler(async (req, res) => {
  const pollId = req.params.id;
  const userId = req.user._id;

  // Find the poll by ID
  const poll = await Poll.findById(pollId).populate("creator", "name");
  if (!poll) {
    res.status(404);
    throw new Error("Poll not found");
  }

  // Check if the poll has expired
  const now = new Date();
  const isExpired = poll.expiresAt < now;

  // Check if the user has already voted
  const userVote = await Vote.findOne({
    user: userId,
    poll: pollId,
  });

  res.json({
    poll,
    userVote: userVote ? userVote.option : null,
    isExpired,
  });
});
export {
  createPoll,
  getPolls,
  getPollById,
  updatePoll,
  deletePoll,
  getPollResults,
  getPollDetails,
};
