import express from "express";
const app = express();
import { MongoClient } from "mongodb";
import usersRouter from "./routes/users.route.js";
import authRouter from "./routes/auth.route.js";
import courseRouter from "./routes/course.route.js";
import progressRouter from "./routes/progress.route.js"; // Assuming you have a progress route

import cors from "cors";

import * as dotenv from "dotenv";
dotenv.config();
app.use(express.json());
app.use(cors());

const PORT = 4000;
app.get("/", function (request, response) {
  response.send("Skill'Ed App");
});

const MONGO_URL = process.env.MONGO_URL;
const client = new MongoClient(MONGO_URL);
await client.connect();
console.log("Mongo is connected successfully!");
app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/course", courseRouter);
app.use("/progress", progressRouter); // Assuming you have a progress route

app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));
export { client };
