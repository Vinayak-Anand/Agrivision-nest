import mongoose, { Document, Schema } from "mongoose";

export interface IContentProgress {
  contentId: string;
  status: string; // e.g., "Completed", "Paused", "In Progress"
}

export interface UserCourseInterface extends Document {
  userId: string; // Reference to the user
  courseId: string; // Reference to the course
  progress: {
    completedPercentage: number; // Percentage of the course completed
    lastAccessedContent: string; // Content ID of the last accessed item
    contentStatus: {
      parentTopicId: string; // Parent topic identifier
      contents: IContentProgress[]; // Track progress for each content in the parent topic
    }[];
  };
  notes: [
    {
      noteId: string; // Unique note identifier
      content: string; // The note content
      timestamp: Date; // When the note was created
    }
  ];
  enrollmentDate: Date;
  completionDate?: Date;
  status: string; // e.g., "In Progress", "Completed"
}

const ContentProgressSchema: Schema = new Schema({
  contentId: { type: String, required: true },
  status: { type: String, default: "In Progress" },
});

const ParentTopicProgressSchema: Schema = new Schema({
  parentTopicId: { type: String, required: true },
  contents: [ContentProgressSchema],
});

const NoteSchema: Schema = new Schema({
  noteId: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const UserCourseSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    courseId: { type: String, required: true },
    progress: {
      completedPercentage: { type: Number, default: 0 },
      lastAccessedContent: { type: String },
      contentStatus: [ParentTopicProgressSchema], // User-specific progress for each parent topic
    },
    notes: [NoteSchema],
    enrollmentDate: { type: Date, default: Date.now },
    completionDate: { type: Date },
    status: { type: String, default: "In Progress" },
  },
  { timestamps: true }
);

export default mongoose.model<UserCourseInterface>("UserCourse", UserCourseSchema);
