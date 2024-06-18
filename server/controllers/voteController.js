import asyncHandler from "express-async-handler";
import Poll from "../models/pollModel.js";
import Vote from "../models/voteModel.js";

/**
 * @desc Vote on a poll
 * @route POST /api/votes
 * @access Private
 */
const vote = asyncHandler(async (req, res) => {
  const { pollId, option } = req.body;

  try {
    // Find the poll by ID
    const poll = await Poll.findById(pollId);
    if (!poll) {
      res.status(404);
      throw new Error("Poll not found");
    }

    // Check if the poll has expired
    const now = new Date();
    if (poll.expiresAt < now) {
      res.status(400);
      throw new Error("Poll has already expired");
    }

    // Check if the user has already voted
    const existingVote = await Vote.findOne({
      user: req.user._id,
      poll: pollId,
    });

    if (existingVote) {
      res.status(400);
      throw new Error("User has already voted on this poll");
    }

    // Create a new vote
    const newVote = new Vote({
      user: req.user._id,
      poll: pollId,
      option,
    });

    await newVote.save();

    // Update poll results
    const votes = await Vote.find({ poll: pollId });
    const result = {};
    poll.options.forEach((opt) => {
      result[opt] = votes.filter((v) => v.option === opt).length;
    });

    poll.results = result;
    await poll.save();

    res.status(201).json({ success: true, vote: newVote });
  } catch (error) {
    res.status(res.statusCode || 500);
    res.json({ message: error.message });
  }
});

const getVoteByPollId = asyncHandler(async (req, res) => {
  const { pollId } = req.params;

  try {
    const vote = await Vote.findOne({ poll: pollId, user: req.user._id });
    if (!vote) {
      res.status(404);
      throw new Error("Vote not found");
    }

    res.status(200).json({ success: true, vote });
  } catch (error) {
    res.status(res.statusCode || 500);
    res.json({ message: error.message });
  }
});

export { vote, getVoteByPollId };
