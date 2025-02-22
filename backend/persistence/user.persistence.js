// import PocketBase from "pocketbase";

// const pb = new PocketBase("http://127.0.0.1:8090"); // Replace with your PocketBase URL

// // Authenticate as admin
// const adminAuth = async () => {
//   await pb.admins.authWithPassword(); // Replace with your admin email and password
// };

// export const createUser = async (userData) => {
//   try {
//     await adminAuth();
//     return await pb.collection("user").create(userData); // Ensure the collection name is correct
//   } catch (error) {
//     console.error("Failed to create user:", error);
//     throw error;
//   }
// };

// export const getUser = async (payload) => {
//   try {
//     await adminAuth();
//     const { email } = payload;
//     const users = await pb
//       .collection("user")
//       .getFullList({ filter: `email="${email}"` }); // Ensure the collection name is correct
//     return users.length > 0 ? users[0] : null;
//   } catch (error) {
//     console.error("Failed to get user:", error.originalError);
//     throw error;
//   }
// };

import User from "../models/User";

export const createUser = async (userData) => {
  console.log("userData", userData);
  const user = new User(userData);
  return await user.save();
};

export const getUser = async (payload) => {
  const user1 = await User.findOne(payload);
  return user1;
};
