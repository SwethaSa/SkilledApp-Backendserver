import express from "express";
import { auth } from "../middleware/auth.js";
import { updateProgress, getProgress } from "../services/progress.service.js";

const router = express.Router();

// UPDATE PROGRESS
router.post("/", auth, async (req, res) => {
  const { courseId, moduleIndex, isCompleted } = req.body;
  const userId = req.user.id;

  await updateProgress(userId, courseId, moduleIndex, isCompleted);
  res.send({ message: "Progress updated" });
});

// GET USER PROGRESS
router.get("/:courseId", auth, async (req, res) => {
  const userId = req.user.id;
  const data = await getProgress(userId, req.params.courseId);
  res.send(data || { progress: {} });
});

export default router;
