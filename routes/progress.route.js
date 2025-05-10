// routes/progress.route.js

import express from "express";
import { auth } from "../middleware/auth.js";
import {
  updateProgress,
  getProgress,
  getNewProgress,
} from "../services/progress.service.js";

const router = express.Router();

router.get("/user/:userId", auth, async (req, res) => {
  const { userId } = req.params;
  const docs = await getNewProgress(userId);
  res.json(docs);
});

router.get("/:userId/:courseId", async (req, res) => {
  const { userId, courseId } = req.params;
  if (!userId || !courseId) {
    return res.status(400).json({ message: "Missing userId or courseId" });
  }
  try {
    const doc = await getProgress(userId, courseId);
    res.json({ progress: doc?.progress || {} });
  } catch (err) {
    console.error("Error fetching progress:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/:userId", auth, async (req, res) => {
  const { userId } = req.params;
  const { courseId, moduleIndex, completed } = req.body;

  if (!courseId || moduleIndex === undefined) {
    return res.status(400).json({ message: "Missing courseId or moduleIndex" });
  }

  try {
    await updateProgress(userId, courseId, moduleIndex, completed);
    res.json({ message: "Progress updated" });
  } catch (err) {
    console.error("Error updating progress:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
