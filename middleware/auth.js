import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const auth = (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    console.log("token: ", token);
    jwt.verify(token, process.env.SECRET_KEY);
    next();
  } catch (error) {
    res.status(401).send({ message: error.message });
  }
};
