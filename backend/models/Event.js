import mongoose from "mongoose";
// import { ObjectId } from "mongodb";

const EventSchema = new mongoose.Schema(
  {
    idUser: { type: String, required: true },
    text: { type: String, required: true },
    start: { type: String, required: true },
    end: { type: String, required: true },
    resource: { type: String, required: true },
    tags: { type: Object },
  },
  { timestamps: true }
);

export default mongoose.models.Event || mongoose.model("Event", EventSchema);
