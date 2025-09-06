import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
// import projectRoutes from "./routes/project.js";
import compileRoutes from "./routes/compile.js"; // Add compile route

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Routes
// app.use("/api/projects", projectRoutes);
app.use("/api/compile", compileRoutes); // Add compile route

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));