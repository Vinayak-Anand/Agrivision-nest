import express from "express";
import {
  insertMaterial,
  createParentTopic,
  makeCourse,
  fetchCourseById,
  fetchCourses,
} from "../controllers/course.controller";

const router = express.Router();

router.post("/", makeCourse); // Create a new course
router.get("/", fetchCourses); // Get all courses
router.get("/:courseId", fetchCourseById); // Get a course by ID
router.post("/:courseId/add-parent-topic", createParentTopic); // Add a parent topic to a course
router.post("/:courseId/:parentTopicId/add-content", insertMaterial); // Add new content to a parent topic

export default router;
