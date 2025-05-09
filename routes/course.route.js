import express from "express";
import {
  createCourse,
  getAllCourses,
  getCoursesByTopic,
  getCourseById,
  updateCourseById,
  deleteCourseById,
} from "../services/courses.service.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// CREATE
router.post("/", auth, async (req, res) => {
  const { topic, subTopic, courseTitle, modules } = req.body;

  if (!topic || !subTopic || !courseTitle || !modules) {
    return res.status(400).send({ message: "Missing required fields" });
  }

  const result = await createCourse(req.body);
  res
    .status(201)
    .send({ message: "Course created", courseId: result.insertedId });
});

// GET ALL
router.get("/", async (req, res) => {
  const data = await getAllCourses();
  res.send(data);
});

// GET BY TOPIC
router.get("/topic/:topic", async (req, res) => {
  const data = await getCoursesByTopic(req.params.topic);
  res.send(data);
});

// GET BY ID
router.get("/:id", async (req, res) => {
  const data = await getCourseById(req.params.id);
  if (!data) return res.status(404).send({ message: "Course not found" });
  res.send(data);
});

// UPDATE
router.put("/:id", auth, async (req, res) => {
  const result = await updateCourseById(req.params.id, req.body);
  if (result.modifiedCount === 0)
    return res.status(404).send({ message: "Not updated" });
  res.send({ message: "Course updated" });
});

// DELETE
router.delete("/:id", auth, async (req, res) => {
  const result = await deleteCourseById(req.params.id);
  if (result.deletedCount === 0)
    return res.status(404).send({ message: "Course not found" });
  res.send({ message: "Course deleted" });
});

export default router;
