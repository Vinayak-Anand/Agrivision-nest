import express from "express";
import {
  createNote,
  deleteNote,
  getNotesByUser,
  updateNote,
} from "../controllers/shortNote.controller";

const router = express.Router();

router.post("/", createNote); // Create a new note
router.get("/:userId", getNotesByUser); // Get all notes for a user
router.put("/:noteId", updateNote); // Update a specific note
router.delete("/:noteId", deleteNote); // Delete a specific note

export default router;
