import express from "express";
const app = express();
import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
dotenv.config();

const PORT = 4000;

const MONGO_URL = process.env.MONGO_URL;

async function startServer() {
  try {
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    console.log("Mongo is connected successfully!");

    app.get("/", function (request, response) {
      response.send("🙋‍♂️, 🌏 🎊✨🤩");
    });

    app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
}

startServer();
