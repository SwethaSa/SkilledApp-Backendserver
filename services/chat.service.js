import { ObjectId } from "mongodb";
import { client } from "../index.js";

export async function getOrCreateChat(learnerId, mentorId) {
  let chat = await client
    .db("skilled")
    .collection("chats")
    .findOne({
      participants: { $all: [learnerId, mentorId] },
    });
  if (!chat) {
    const now = new Date();
    const result = await client
      .db("skilled")
      .collection("chats")
      .insertOne({
        participants: [learnerId, mentorId],
        lastMessage: null,
        lastTimestamp: now,
        unreadBy: { [mentorId]: 0, [learnerId]: 0 },
      });
    chat = {
      _id: result.insertedId,
      participants: [learnerId, mentorId],
      lastMessage: null,
      lastTimestamp: now,
      unreadBy: { [mentorId]: 0, [learnerId]: 0 },
    };
  }
  return chat;
}

export async function getChatsForMentor(mentorId) {
  return await client
    .db("skilled")
    .collection("chats")
    .find({ participants: mentorId })
    .sort({ lastTimestamp: -1 })
    .toArray();
}

export async function postMessage(chatId, sender, text) {
  const timestamp = new Date();
  const result = await client
    .db("skilled")
    .collection("messages")
    .insertOne({
      chatId: new ObjectId(chatId),
      sender,
      text,
      timestamp,
    });

  const chatObjId = new ObjectId(chatId);
  const chat = await client
    .db("skilled")
    .collection("chats")
    .findOne({ _id: chatObjId });
  const other = chat.participants.find((p) => p !== sender);

  await client
    .db("skilled")
    .collection("chats")
    .updateOne(
      { _id: chatObjId },
      {
        $set: { lastMessage: text, lastTimestamp: timestamp },
        $inc: { [`unreadBy.${other}`]: 1 },
      }
    );

  return { _id: result.insertedId, chatId, sender, text, timestamp };
}

export async function getMessagesByChatId(chatId) {
  return await client
    .db("skilled")
    .collection("messages")
    .find({ chatId: new ObjectId(chatId) })
    .sort({ timestamp: 1 })
    .toArray();
}
