// routes/progress.route.js
import express from "express";
import { auth } from "../middleware/auth.js";
import {
  updateProgress,
  getProgress,
  getNewProgress,
} from "../services/progress.service.js";

const router = express.Router();

// ——— GET ALL progress docs for a user ———
router.get("/user/:userId", auth, async (req, res) => {
  console.log("🔍 [progress] GET /user/:userId called for", req.params.userId);
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ message: "Missing userId" });

    const docs = await getNewProgress(userId);
    return res.json(docs);
  } catch (err) {
    console.error("Error fetching all progress:", err);
    return res
      .status(500)
      .json({ message: "Internal server error fetching all progress" });
  }
});

// ——— GET ONE course’s progress ———
router.get("/:userId/:courseId", auth, async (req, res) => {
  console.log("🔍 [progress] GET /:userId/:courseId called for", req.params);
  try {
    const { userId, courseId } = req.params;
    if (!userId || !courseId)
      return res.status(400).json({ message: "Missing userId or courseId" });

    const doc = await getProgress(userId, courseId);
    return res.json({ progress: doc?.progress || {} });
  } catch (err) {
    console.error("Error fetching single progress:", err);
    return res
      .status(500)
      .json({ message: "Internal server error fetching single progress" });
  }
});

// ——— UPDATE (or create) one module’s progress ———
router.post("/:userId", auth, async (req, res) => {
  console.log(
    "🔄 [progress] POST /:userId called for",
    req.params.userId,
    "body:",
    req.body
  );
  try {
    const { userId } = req.params;
    const { courseId, moduleIndex, completed } = req.body;
    if (!courseId || moduleIndex === undefined)
      return res
        .status(400)
        .json({ message: "Missing courseId or moduleIndex" });

    await updateProgress(userId, courseId, moduleIndex, completed);
    return res.json({ message: "Progress updated" });
  } catch (err) {
    console.error("Error updating progress:", err);
    return res
      .status(500)
      .json({ message: "Internal server error updating progress" });
  }
});

export default router;
