import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import userRouter from "./routers/user.router";
import pollRouter from "./routers/poll.router";
import { errorMiddleware } from "./middlewares/error.middleware";
import uploadRouter from "./routers/upload.router";

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// apis
app.use("/api/v1/user", userRouter);
app.use("/api/v1/poll", pollRouter);
app.use("/api/v1/upload", uploadRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("server is running!!");
});

// global error middleware
app.use(errorMiddleware);

export default app;
