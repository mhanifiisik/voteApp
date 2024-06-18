import express from "express";
import userRoutes from "./userRoutes.js";
import pollRoutes from "./pollRoutes.js";
import voteRoutes from "./voteRoutes.js";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/polls", pollRoutes);
router.use("/votes", voteRoutes);

export default router;
