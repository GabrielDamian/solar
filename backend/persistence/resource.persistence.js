// import PocketBase from 'pocketbase';

// const pb = new PocketBase('http://127.0.0.1:8090'); // Replace with your PocketBase URL

// export const createResource = async (resourceData) => {
//   return await pb.collection('resources').create(resourceData);
// };

// export const getResources = async (vendor) => {
//   if (!vendor) return await pb.collection('resources').getFullList();
//   else return await pb.collection('resources').getFullList({ filter: `vendor="${vendor}"` });
// };

// export const deleteResource = async (id) => {
//   return await pb.collection('resources').delete(id);
// };

// export const updateResource = async (id, resource) => {
//   return await pb.collection('resources').update(id, resource);
// };
import { ObjectId } from "mongodb";

import Resource from "../models/Resource";

export const createResource = async (resourceData) => {
  const resource = new Resource(resourceData);
  return await resource.save();
};

export const getResources = async (vendor) => {
  if (!vendor) return await Resource.find();
  else return await Resource.find({ vendor });
};

export const deleteResource = async (id) => {
  return await Resource.deleteOne({ _id: id });
};

export const updateResource = async (id, resource) => {
  return await Resource.findByIdAndUpdate({ _id: ObjectId(id) }, resource);
};
