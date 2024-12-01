import { Request, Response } from "express";
import Course, { CourseInterface } from "../models/course.model";
import UserCourse from "../models/userCourse.model";

export const makeCourse = async (req: Request, res: Response) => {
  try {
    const course: CourseInterface = new Course(req.body);
    const savedCourse = await course.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const createParentTopic = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { courseId } = req.params;
  const { parentId, title } = req.body;

  try {
    // Find the course by courseId
    const course = await Course.findOne({ courseId });

    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    // Check if a parent topic with the same parentId already exists
    const existingParent = course.parentTopics.find(
      (topic) => topic.parentId === parentId
    );

    if (existingParent) {
      res
        .status(400)
        .json({ message: "Parent topic with the same ID already exists" });
      return;
    }

    // Add the new parent topic
    course.parentTopics.push({
      parentId,
      title,
      contents: [], // Initialize with an empty contents array
    });

    // Save the updated course
    await course.save();

    // Update all related UserCourse entries
    await UserCourse.updateMany(
      { courseId },
      {
        $push: {
          "progress.contentStatus": {
            parentTopicId: parentId,
            contents: [], // No contents initially
          },
        },
      }
    );

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const insertMaterial = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { courseId, parentTopicId } = req.params;
  const { contentId, type, title, url } = req.body;

  try {
    // Find the course by courseId
    const course = await Course.findOne({ courseId });

    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    // Find the parent topic by parentTopicId
    const parentTopicIndex = course.parentTopics.findIndex(
      (topic) => topic.parentId === parentTopicId
    );

    if (parentTopicIndex === -1) {
      res.status(404).json({ message: "Parent topic not found in the course" });
      return;
    }

    // Add the new content to the parent topic
    course.parentTopics[parentTopicIndex].contents.push({
      contentId,
      type,
      title,
      url,
    });

    // Save the updated course
    await course.save();

    // Update all related UserCourse entries
    await UserCourse.updateMany(
      { courseId, "progress.contentStatus.parentTopicId": parentTopicId },
      {
        $push: {
          "progress.contentStatus.$.contents": {
            contentId,
            status: "Not Completed", // Default status for new content
          },
        },
      }
    );

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const fetchCourses = async (req: Request, res: Response) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const fetchCourseById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const course = await Course.findOne({ courseId: req.params.courseId });
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
