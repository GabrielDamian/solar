import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import ResourcesTable from "./ResourcesTable";

export default function VendorDashboard() {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);

  const getResources = async () => {
    const columnsData = await axios.get("/api/resource?id=" + user?._id);

    const columns = columnsData.data.resources;
    setResources(columns);
  };

  useEffect(() => {
    getResources();
  }, [user]);

  return (
    <div>
      <Typography>Your solars</Typography>
      <br />
      <ResourcesTable resources={resources} setResources={setResources} />
      <br />
    </div>
  );
}
