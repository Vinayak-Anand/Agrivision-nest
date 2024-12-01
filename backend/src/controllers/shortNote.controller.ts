import { Request, Response } from "express";
import ShortNote, { IShortNote } from "../models/shortNote.model";

export const createNote = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { noteId, userId, context, contextId, title, content } = req.body;

    const newNote: IShortNote = new ShortNote({
      noteId,
      userId,
      context,
      contextId,
      title,
      content,
    });

    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const getNotesByUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;
    const notes = await ShortNote.find({ userId });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const updateNote = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { noteId } = req.params;
    const { title, content } = req.body;

    const updatedNote = await ShortNote.findOneAndUpdate(
      { noteId },
      { $set: { title, content } },
      { new: true }
    );

    if (!updatedNote) {
      res.status(404).json({ message: "Note not found" });
      return;
    }

    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const deleteNote = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { noteId } = req.params;

    const deletedNote = await ShortNote.findOneAndDelete({ noteId });
    if (!deletedNote) {
      res.status(404).json({ message: "Note not found" });
      return;
    }

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};
