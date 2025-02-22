// import PocketBase from 'pocketbase';

// const pb = new PocketBase('http://127.0.0.1:8090'); // Replace with your PocketBase URL

// export const createEvent = async (eventData) => {
//   return await pb.collection('events').create(eventData);
// };

// export const getEvents = async () => {
//   return await pb.collection('events').getFullList();
// };

// export const deleteEvent = async (id) => {
//   return await pb.collection('events').delete(id);
// };

// export const updateEvent = async (id, event) => {
//   return await pb.collection('events').update(id, event);
// };

import Event from "../models/Event";

export const createEvent = async (eventData) => {
  const event = new Event(eventData);
  return await event.save();
};

export const getEvents = async () => {
  return await Event.find();
};

export const deleteEvent = async (id) => {
  return await Event.deleteOne({ _id: id });
};

export const updateEvent = async (id, event) => {
  return await Event.findByIdAndUpdate({ _id: id }, event);
};
