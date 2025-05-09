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

// CREATE COURSE
router.post("/", auth, async (req, res) => {
  const { topic, subTopic, courseTitle, description, modules } = req.body;

  if (!topic || !subTopic || !courseTitle || !modules) {
    return res.status(400).send({ message: "Missing required fields" });
  }

  try {
    const result = await createCourse(req.body);
    res
      .status(201)
      .send({ message: "Course created", courseId: result.insertedId });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error creating course", error: error.message });
  }
});

// GET ALL COURSES
router.get("/", async (req, res) => {
  try {
    const data = await getAllCourses();
    res.send(data);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error fetching courses", error: error.message });
  }
});

// GET COURSES BY TOPIC
router.get("/topic/:topic", async (req, res) => {
  try {
    const data = await getCoursesByTopic(req.params.topic);
    res.send(data);
  } catch (error) {
    res.status(500).send({
      message: "Error fetching courses by topic",
      error: error.message,
    });
  }
});

// GET COURSE BY ID
router.get("/:id", async (req, res) => {
  try {
    const data = await getCourseById(req.params.id);
    if (!data) return res.status(404).send({ message: "Course not found" });
    res.send(data);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error fetching course", error: error.message });
  }
});

// UPDATE COURSE BY ID
router.put("/:id", auth, async (req, res) => {
  try {
    const result = await updateCourseById(req.params.id, req.body);
    if (result.modifiedCount === 0)
      return res.status(404).send({ message: "Not updated" });
    res.send({ message: "Course updated" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error updating course", error: error.message });
  }
});

// DELETE COURSE BY ID
router.delete("/:id", auth, async (req, res) => {
  try {
    const result = await deleteCourseById(req.params.id);
    if (result.deletedCount === 0)
      return res.status(404).send({ message: "Course not found" });
    res.send({ message: "Course deleted" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error deleting course", error: error.message });
  }
});

export default router;
