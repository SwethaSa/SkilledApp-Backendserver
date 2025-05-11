import { client } from "../index.js";
import { ObjectId } from "mongodb";
export async function createUsers(data) {
  return await client.db("skilled").collection("users").insertOne(data);
}

export async function getAllUsers() {
  return await client.db("skilled").collection("users").find({}).toArray();
}

export async function getUserByName(name) {
  return await client.db("skilled").collection("users").findOne({ name: name });
}

export async function getUserByEmail(email) {
  return client.db("skilled").collection("users").findOne({ email });
}

export async function getUserById(id) {
  return await client
    .db("skilled")
    .collection("users")
    .findOne({ _id: new ObjectId(id) });
}

export async function updateUserById(id, updateData) {
  return await client
    .db("skilled")
    .collection("users")
    .updateOne({ _id: new ObjectId(id) }, { $set: updateData });
}

export async function deleteUserById(id) {
  return await client
    .db("skilled")
    .collection("users")
    .deleteOne({ _id: new ObjectId(id) });
}

export async function saveResetToken(userId, token, expiresAt) {
  await client
    .db("skilled")
    .collection("token")
    .insertOne({
      userId: new ObjectId(userId),
      token,
      expiresAt,
    });
}

export async function getResetTokenDoc(token) {
  return await client.db("skilled").collection("token").findOne({ token });
}

export async function deleteResetToken(token) {
  await client.db("skilled").collection("token").deleteOne({ token });
}

export async function findEmail(email) {
  return client.db("skilled").collection("users").findOne({ email });
}
