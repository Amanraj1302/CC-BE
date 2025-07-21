import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import {userRoutes} from "./routes/userRoutes";
import cookieParser from "cookie-parser";
import { artistRoutes } from "./routes/artistRoute";
import { ProjectFormRoutes } from "./routes/projectFormRoute";  
import path from "path";

dotenv.config();

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use("/api/users", userRoutes);
app.use("/api/artist", artistRoutes);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api/project",ProjectFormRoutes)
const Port = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI!)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(Port, () => {
      console.log("Server running on port" + `http://localhost:${Port}`);
    });
  })
  .catch(err => console.error(err));
