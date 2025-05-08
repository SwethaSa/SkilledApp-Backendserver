import { client } from "../index.js";

export async function createUsers(data) {
  return await client.db("skilled").collection("users").insertOne(data);
}

export async function getAllUsers() {
  return await client.db("skilled").collection("users").find({}).toArray();
}

export async function getUserByName(name) {
  return await client.db("skilled").collection("users").findOne({ name: name });
}
