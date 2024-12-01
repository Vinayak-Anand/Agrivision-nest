import express from "express";
import {
  addContent,
  addParentTopic,
  createCourse,
  getCourseById,
  getCourses,
} from "../controllers/course.controller";

const router = express.Router();

router.post("/", createCourse); // Create a new course
router.get("/", getCourses); // Get all courses
router.get("/:courseId", getCourseById); // Get a course by ID
router.post("/:courseId/add-parent-topic", addParentTopic); // Add a parent topic to a course
router.post("/:courseId/:parentTopicId/add-content", addContent); // Add new content to a parent topic

export default router;
