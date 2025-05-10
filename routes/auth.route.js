// routes/auth/google-login.js

import express from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { client as mongoClient } from "../index.js";

const router = express.Router();
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const SECRET_KEY = process.env.SECRET_KEY;

const googleClient = new OAuth2Client(CLIENT_ID);

router.post("/google-login", async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) {
    return res.status(400).json({ message: "Missing idToken in request body" });
  }

  try {
    // 1) Verify Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: CLIENT_ID,
    });
    const { email, name, picture, sub: googleId } = ticket.getPayload();

    // 2) Find or create the user
    const usersCollection = mongoClient.db("skilled").collection("users");
    let user = await usersCollection.findOne({ email });

    if (!user) {
      const newUser = {
        name,
        email,
        googleId,
        picture,
        createdAt: new Date(),
      };
      const result = await usersCollection.insertOne(newUser);
      user = { ...newUser, _id: result.insertedId };
    }

    // 3) Sign a JWT with payload { id: user._id }
    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "1h" });

    // 4) Return token and userId
    return res.status(200).json({
      token,
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
      picture: user.picture,
    });
  } catch (err) {
    console.error("Google login error:", err);
    return res.status(401).json({ message: "Invalid Google token" });
  }
});

export default router;
