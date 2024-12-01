import { Request, Response } from "express";
import Course from "../models/course.model";
import UserCourse, { UserCourseInterface } from "../models/userCourse.model";

export const enrollInCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, courseId } = req.body;

    // Fetch the course details
    const course = await Course.findOne({ courseId });
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    // Populate progress with all parent topics and their contents
    const progress = {
      completedPercentage: 0,
      lastAccessedContent: null,
      contentStatus: course.parentTopics.map((parentTopic) => ({
        parentTopicId: parentTopic.parentId,
        contents: parentTopic.contents.map((content) => ({
          contentId: content.contentId,
          status: "Not Completed", // Default status
        })),
      })),
    };

    // Create a new user-course
    const userCourse: UserCourseInterface = new UserCourse({
      userId,
      courseId,
      progress,
      notes: [],
      status: "In Progress",
      enrollmentDate: new Date(),
    });

    // Save the user-course
    const savedUserCourse = await userCourse.save();
    res.status(201).json(savedUserCourse);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const getUserCourses = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userCourses = await UserCourse.find({ userId: req.params.userId });
    res.status(200).json(userCourses);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const getUserCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, courseId } = req.params;
    const userCourse = await UserCourse.findOne({ userId, courseId });
    res.status(200).json(userCourse);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const updateContentStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, courseId } = req.params;
  const { parentTopicId, contentId, status } = req.body;

  try {
    // Fetch the user-course document
    const userCourse = await UserCourse.findOne({ userId, courseId });

    if (!userCourse) {
      res.status(404).json({ message: "User-Course relationship not found" });
      return;
    }

    // Find the parent topic by parentTopicId
    const parentTopicIndex = userCourse.progress.contentStatus.findIndex(
      (topic) => topic.parentTopicId === parentTopicId
    );

    if (parentTopicIndex === -1) {
      res.status(404).json({ message: "Parent topic not found in progress" });
      return;
    }

    // Find the content by contentId within the parent topic
    const contentIndex = userCourse.progress.contentStatus[
      parentTopicIndex
    ].contents.findIndex((content) => content.contentId === contentId);

    if (contentIndex !== -1) {
      // Update existing content status
      userCourse.progress.contentStatus[parentTopicIndex].contents[
        contentIndex
      ].status = status;
    } else {
      // Add new content status if it doesn't exist
      userCourse.progress.contentStatus[parentTopicIndex].contents.push({
        contentId,
        status,
      });
    }

    // Save the updated user-course document
    await userCourse.save();

    res.status(200).json(userCourse);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const getFilteredContents = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, courseId } = req.params;
  const { filter } = req.query; // e.g., "All", "Completed", "Paused"

  try {
    // Fetch user-course relationship
    const userCourse = await UserCourse.findOne({ userId, courseId });
    if (!userCourse) {
      res.status(404).json({ message: "User-Course relationship not found" });
      return;
    }

    const filteredContents = userCourse.progress.contentStatus.map((topic) => {
      const filteredTopic = {
        parentTopicId: topic.parentTopicId,
        contents:
          filter && filter !== "All"
            ? topic.contents.filter((content) => content.status === filter)
            : topic.contents, // Return all contents if no filter is applied
      };
      return filteredTopic;
    });

    res.status(200).json(filteredContents);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const updateProgress = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, courseId } = req.params;
    const { completedPercentage, lastAccessedContent } = req.body;

    const userCourse = await UserCourse.findOneAndUpdate(
      { userId, courseId },
      {
        $set: {
          "progress.completedPercentage": completedPercentage,
          "progress.lastAccessedContent": lastAccessedContent,
        },
      },
      { new: true }
    );

    if (!userCourse) {
      res.status(404).json({ message: "User-Course relationship not found" });
      return;
    }

    res.status(200).json(userCourse);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const getNotes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, courseId } = req.params;
    const userCourse = await UserCourse.findOne({
      userId,
      courseId,
    });
    res.status(200).json(userCourse?.notes);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const getNoteById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, courseId, noteId } = req.params;
    const userCourse = await UserCourse.findOne({
      userId,
      courseId,
      "notes.noteId": noteId,
    });
    const note = userCourse?.notes.find((note) => note.noteId === noteId);
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const addNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, courseId } = req.params;
    const { noteId, content } = req.body;

    const userCourse = await UserCourse.findOneAndUpdate(
      { userId, courseId },
      { $push: { notes: { noteId, content } } },
      { new: true }
    );

    if (!userCourse) {
      res.status(404).json({ message: "User-Course relationship not found" });
      return;
    }

    res.status(200).json(userCourse);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const updateNote = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, courseId, noteId } = req.params;
    const { content } = req.body;

    const userCourse = await UserCourse.findOneAndUpdate(
      { userId, courseId, "notes.noteId": noteId },
      { $set: { "notes.$.content": content } },
      { new: true }
    );

    if (!userCourse) {
      res.status(404).json({ message: "Note not found" });
      return;
    }

    res.status(200).json(userCourse);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const deleteNote = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, courseId, noteId } = req.params;

    const userCourse = await UserCourse.findOneAndUpdate(
      { userId, courseId },
      { $pull: { notes: { noteId } } },
      { new: true }
    );

    if (!userCourse) {
      res.status(404).json({ message: "Note not found" });
      return;
    }

    res.status(200).json(userCourse);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};
