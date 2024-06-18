import express from "express";
import { vote, getVoteByPollId } from "../controllers/voteController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/votes:
 *   post:
 *     summary: Vote on a poll
 *     tags: [Votes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pollId
 *               - option
 *             properties:
 *               pollId:
 *                 type: string
 *                 description: Poll ID
 *               option:
 *                 type: string
 *                 description: Option chosen by the user
 *     responses:
 *       201:
 *         description: Vote recorded successfully
 *       400:
 *         description: Poll not found, already expired, or user has already voted
 */
router.route("/").post(protect, vote);

/**
 * @swagger
 * /api/votes/{pollId}/{userId}:
 *   get:
 *     summary: Check if the user has voted on a poll
 *     tags: [Votes]
 *     parameters:
 *       - in: path
 *         name: pollId
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: User has voted
 *       404:
 *         description: User has not voted on this poll
 */
router.route("/:pollId/:userId").get(protect, getVoteByPollId);

export default router;
