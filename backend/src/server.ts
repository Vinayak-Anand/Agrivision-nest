import cors from "cors";
import dotenv from "dotenv";
import express, { Application } from "express";
import connectDB from "./config/db";
import errorHandler from "./middlewares/errorHandler";


import courseRoutes from "./routes/course.routes";
import shortNoteRoutes from "./routes/shortNote.routes";
import userRoutes from "./routes/user.routes";
import userCourseRoutes from "./routes/userCourse.routes";


dotenv.config();
connectDB();

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(errorHandler);

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/users", userRoutes);

app.use("/api/courses", courseRoutes);

app.use("/api/user-courses", userCourseRoutes);

app.use("/api/notes", shortNoteRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
