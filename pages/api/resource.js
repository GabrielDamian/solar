import { connectToDatabase } from "../../lib/mongodb";
import {
  getResources,
  createResource,
  deleteResource,
  updateResource,
} from "../../backend/persistence/resource.persistence";

export default async function handler(req, res) {
  try {
    await connectToDatabase();

    let { resource } = req.body;
    const { id } = req.query;
    switch (req.method) {
      case "POST":
        const resourceResult = await createResource(resource);
        return res
          .status(201)
          .json({ message: "Resource created successfully", resourceResult });

      case "GET":
        if (!id) {
          const resources = await getResources();
          return res
            .status(200)
            .json({ message: "Resources fetched successfully", resources });
        } else {
          const resources = await getResources(id);
          return res
            .status(200)
            .json({ message: "Resources fetched successfully", resources });
        }
      case "DELETE":
        const deleteResult = await deleteResource(id);
        return res
          .status(200)
          .json({ message: "Resources deleted successfully", deleteResult });

      case "PUT":
        const putResult = await updateResource(id, resource);
        return res
          .status(200)
          .json({ message: "Resources updated successfully", putResult });

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
