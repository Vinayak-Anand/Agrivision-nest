import { Request, Response } from "express";
import User, { IUser } from "../models/user.model";

export const createUser = async (req: Request, res: Response) => {
  try {
    const user: IUser = new User(req.body);
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
