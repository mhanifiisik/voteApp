import express from "express";
import {
  createPoll,
  getPolls,
  getPollById,
  updatePoll,
  deletePoll,
  getPollResults,
} from "../controllers/pollController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/polls:
 *   post:
 *     summary: Create a new poll
 *     tags: [Polls]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - options
 *               - duration
 *             properties:
 *               title:
 *                 type: string
 *                 description: Poll title
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Poll options
 *               duration:
 *                 type: integer
 *                 description: Poll duration in minutes
 *     responses:
 *       201:
 *         description: Poll created successfully
 */
router.route("/").post(protect, createPoll).get(protect, getPolls);

/**
 * @swagger
 * /api/polls/{id}:
 *   get:
 *     summary: Get poll by ID
 *     tags: [Polls]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Poll ID
 *     responses:
 *       200:
 *         description: Poll retrieved successfully
 *       404:
 *         description: Poll not found
 *   put:
 *     summary: Update poll by ID
 *     tags: [Polls]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Poll ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Poll updated successfully
 *       404:
 *         description: Poll not found
 *   delete:
 *     summary: Delete poll by ID
 *     tags: [Polls]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Poll ID
 *     responses:
 *       200:
 *         description: Poll deleted successfully
 *       404:
 *         description: Poll not found
 */

router
  .route("/:id")
  .get(protect, getPollById)
  .put(protect, updatePoll)
  .delete(protect, deletePoll);

/**
 * @swagger
 * /api/polls/{id}/result:
 *   get:
 *     summary: Get poll result by ID
 *     tags: [Polls]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Poll ID
 *     responses:
 *       200:
 *         description: Poll result retrieved successfully
 *       404:
 *         description: Poll not found
 */
router.get("/:id/results", protect, getPollResults);

export default router;
