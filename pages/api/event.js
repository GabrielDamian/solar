import { connectToDatabase } from "../../lib/mongodb";
import {
  getEvents,
  createEvent,
  deleteEvent,
  updateEvent,
} from "../../backend/persistence/event.persistence";

export default async function handler(req, res) {
  try {
    await connectToDatabase();

    let { event } = req.body;
    const { id } = req.query;
    switch (req.method) {
      case "POST":
        const eventResult = await createEvent(event);
        return res
          .status(201)
          .json({ message: "Event created successfully", eventResult });

      case "GET":
        const events = await getEvents();
        return res
          .status(200)
          .json({ message: "Events fetched successfully", events });

      case "DELETE":
        const deleteResult = await deleteEvent(id);
        return res
          .status(200)
          .json({ message: "Events deleted successfully", deleteResult });

      case "PUT":
        const putResult = await updateEvent(id, event);
        return res
          .status(200)
          .json({ message: "Events updated successfully", putResult });

      default:
        return res
          .status(405)
          .json({ message: "Only POST requests are allowed" });
    }
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Something went wrong", error });
  }
}
