// routes/chat.route.js
import express from "express";
import {
  getOrCreateChat,
  getChatsForMentor,
  getMessagesByChatId,
  postMessage,
} from "../services/chat.service.js";
import { auth } from "../middleware/auth.js"; // apply auth if needed

const router = express.Router();

// 1. Ensure chat exists or retrieve existing chatId
// POST /chat
router.post("/", auth, async (req, res, next) => {
  try {
    const { learnerId, mentorId } = req.body;
    const chat = await getOrCreateChat(learnerId, mentorId);
    res.json(chat);
  } catch (err) {
    next(err);
  }
});

// 2. List all chats for a mentor
// GET /chat?mentorId=...
router.get("/", auth, async (req, res, next) => {
  try {
    const { mentorId } = req.query;
    const chats = await getChatsForMentor(mentorId);
    res.json(chats);
  } catch (err) {
    next(err);
  }
});

// 3. Post a message to a chat
// POST /chat/:chatId/messages
router.post("/:chatId/messages", auth, async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const { sender, text } = req.body;
    const message = await postMessage(chatId, sender, text);
    res.json(message);
  } catch (err) {
    next(err);
  }
});

// 4. Get all messages for a chat
// GET /chat/:chatId/messages
router.get("/:chatId/messages", auth, async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const messages = await getMessagesByChatId(chatId);
    res.json(messages);
  } catch (err) {
    next(err);
  }
});

export default router;
