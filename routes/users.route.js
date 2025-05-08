import express from "express";
const router = express.Router();
import {
  createUsers,
  getAllUsers,
  getUserByName,
} from "../services/users.service.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { auth } from "../middleware/auth.js";
dotenv.config();

async function generateHashedPassword(password) {
  const NO_OF_ROUNDS = 10;
  const salt = await bcrypt.genSalt(NO_OF_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}
//GET USER DATA
router.get("/", auth, async function (req, res) {
  const dbData = await getAllUsers();
  res.send(dbData);
});

//CREATE USER LOGIC
router.post("/signup", async function (req, res) {
  const { name, email, phone, password } = req.body;

  const userFromDB = await getUserByName(name);
  console.log("userFromDB: ", userFromDB);

  if (userFromDB) {
    res.status(400).send({ message: "User Name already exists!" });
    return;
  } else if (password.length < 8) {
    res
      .status(400)
      .send({ message: "Password should be at least 8 characters long!" });
    return;
  } else {
    const hashedPassword = await generateHashedPassword(password);
    const userData = await createUsers({
      name: name,
      email: email,
      phone: phone,
      password: hashedPassword,
    });

    res.send(userData);
  }
});

//LOGIN LOGIC
router.post("/login", async function (req, res) {
  const { name, password } = req.body;

  const userFromDB = await getUserByName(name);
  console.log("userFromDB: ", userFromDB);

  if (!userFromDB) {
    res.status(401).send({ message: "Invalid Credentials" });
    return;
  } else {
    const storedPassword = userFromDB.password;
    const isPasswordMatch = await bcrypt.compare(password, storedPassword);
    console.log("isPasswordMatch: ", isPasswordMatch);

    if (isPasswordMatch) {
      const token = jwt.sign({ id: userFromDB._id }, process.env.SECRET_KEY);
      res.send({ message: "Login Success", token: token });
    } else {
      res.status(401).send({ message: "Invalid Credentials" });
    }
  }
});

export default router;
