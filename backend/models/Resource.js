import mongoose from "mongoose";

const ResourceSchema = new mongoose.Schema(
  {
    vendor: { type: String, required: true },
    name: { type: String, required: true },
    // id: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Resource ||
  mongoose.model("Resource", ResourceSchema);
