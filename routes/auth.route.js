import express from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { client as mongoClient } from "../index.js";

const router = express.Router();
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const KEYKEY = process.env.SECRET_KEY;

const googleClient = new OAuth2Client(CLIENT_ID);

router.post("/google-login", async (req, res) => {
  const { idToken } = req.body;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    const usersCollection = mongoClient.db("skilled").collection("users");

    let user = await usersCollection.findOne({ email });

    if (!user) {
      user = {
        name,
        email,
        googleId,
        picture,
        createdAt: new Date(),
      };
      await usersCollection.insertOne(user);
    }

    // Create JWT token
    const token = jwt.sign({ email: user.email, id: user._id }, KEYKEY, {
      expiresIn: "1h",
    });

    res.status(200).json({ token, user });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(401).json({ message: "Invalid Google token" });
  }
});

export default router;
