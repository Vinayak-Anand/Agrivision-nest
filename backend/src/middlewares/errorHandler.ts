import { NextFunction, Request, Response } from "express";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "An unexpected error occurred", error: err.message });
};

export default errorHandler;
