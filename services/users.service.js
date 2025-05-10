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
