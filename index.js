import express from "express";
import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
import usersRouter from "./routes/users.route.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

const MONGO_URL = process.env.MONGO_URL;
const client = new MongoClient(MONGO_URL);

async function startServer() {
  try {
    await client.connect();
    console.log("Mongo is connected successfully!");

    // Middleware
    app.use(express.json()); // To parse JSON request body
    app.use("/users", usersRouter); // Register routes for users

    // Default Route
    app.get("/", (req, res) => {
      res.send("🙋‍♂️, 🌏 🎊✨🤩");
    });

    app.listen(PORT, () => {
      console.log(`The server started in: ${PORT} ✨✨`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
}

startServer();

export { client };
