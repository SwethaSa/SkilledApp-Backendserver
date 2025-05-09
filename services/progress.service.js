import { client } from "../index.js";

export async function updateProgress(
  userId,
  courseId,
  moduleIndex,
  isCompleted
) {
  return await client
    .db("skilled")
    .collection("progress")
    .updateOne(
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
  const result = await client
    .db("skilled")
    .collection("progress")
    .findOne({ userId, courseId });

  console.log("DB Result:", result);
  return result;
}

// ✅ FIXED: This function is now correctly outside
export async function markCompleted(client, userId, courseId, moduleIndex) {
  const key = `progress.${moduleIndex}`;

  const result = await client
    .db("skilled")
    .collection("progress")
    .updateOne(
      { userId, courseId },
      {
        $set: {
          [key]: true,
          userId,
          courseId,
        },
      },
      { upsert: true }
    );

  console.log("Progress Updated:", result);
}
