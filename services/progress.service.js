import { client } from "../index.js";

export async function updateProgress(
  userId,
  courseId,
  moduleIndex,
  isCompleted
) {
  return await progressCollection.updateOne(
    { userId, courseId },
    {
      $set: {
        [`progress.${moduleIndex}`]: isCompleted,
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  );
}

export async function getProgress(userId, courseId) {
  return await client
    .db("skilled")
    .collection("progress")
    .findOne({ userId, courseId });
}
