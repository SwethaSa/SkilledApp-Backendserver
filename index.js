import express from "express";
const app = express();
import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
dotenv.config();

const PORT = 4000;
app.get("/", function (request, response) {
  response.send("🙋‍♂️, 🌏 🎊✨🤩");
});

app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));
