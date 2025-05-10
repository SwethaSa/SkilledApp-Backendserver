// services/progress.service.js

import { client } from "../index.js";

export async function updateProgress(userId, courseId, moduleIndex, completed) {
  const key = `progress.${moduleIndex}`;
  return client
    .db("skilled")
    .collection("progress")
    .updateOne(
      { userId, courseId },
      { $set: { [key]: completed, updatedAt: new Date() } },
      { upsert: true }
    );
}

export async function getProgress(userId, courseId) {
  return client
    .db("skilled")
    .collection("progress")
    .findOne({ userId, courseId });
}
