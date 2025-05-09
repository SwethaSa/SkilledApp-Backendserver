import express from "express";
import { auth } from "../middleware/auth.js";
import { updateProgress, markCompleted } from "../services/progress.service.js";

const router = express.Router();

// UPDATE PROGRESS
router.post("/", auth, async (req, res) => {
  const { courseId, moduleIndex, isCompleted } = req.body;
  const userId = req.user.id;

  await updateProgress(userId, courseId, moduleIndex, isCompleted);
  res.send({ message: "Progress updated" });
});

// utils/progress.js

// GET USER PROGRESS
router.post("/:courseId", async (req, res) => {
  const courseId = req.params.courseId;
  const { userId, moduleIndex } = req.body;

  if (!userId || moduleIndex === undefined) {
    return res
      .status(400)
      .json({ error: "userId and moduleIndex are required" });
  }

  try {
    await markCompleted(client, userId, courseId, moduleIndex);
    res.json({ success: true });
  } catch (err) {
    console.error("Error marking progress:", err);
    res.status(500).json({ error: "Failed to mark progress" });
  }
});

export default router;
