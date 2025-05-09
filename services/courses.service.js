import { client } from "../index.js";
import { ObjectId } from "mongodb";

export async function createCourse(data) {
  return await client
    .db("skilled")
    .collection("courses")
    .insertOne({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
}

export async function getAllCourses() {
  return await client.db("skilled").collection("courses").find({}).toArray();
}

export async function getCoursesByTopic(topic) {
  return await client
    .db("skilled")
    .collection("courses")
    .find({ topic: { $regex: new RegExp(`^${topic}$`, "i") } })
    .toArray();
}

export async function getCourseById(id) {
  return await client
    .db("skilled")
    .collection("courses")
    .findOne({ _id: new ObjectId(id) });
}

export async function updateCourseById(id, updates) {
  return await client
    .db("skilled")
    .collection("courses")
    .updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updates, updatedAt: new Date() } }
    );
}

export async function deleteCourseById(id) {
  return await client
    .db("skilled")
    .collection("courses")
    .deleteOne({ _id: new ObjectId(id) });
}
