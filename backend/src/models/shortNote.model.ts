import mongoose, { Document, Schema } from "mongoose";

export interface IShortNote extends Document {
  noteId: string; // Unique identifier for the note
  userId: string; // Reference to the user
  context: string; // Context of the note (e.g., "course", "testSeries", "general")
  contextId?: string; // Reference to the related course or test series (optional for general notes)
  title: string; // Title of the note
  content: string; // Content of the note
  timestamp: Date; // Creation timestamp
}

const ShortNoteSchema: Schema = new Schema(
  {
    noteId: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    context: { type: String, required: true },
    contextId: { type: String },
    title: { type: String, required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IShortNote>("ShortNote", ShortNoteSchema);
