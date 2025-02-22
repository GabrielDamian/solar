import * as React from "react";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  IconButton,
  Paper,
  TableRow,
  TableHead,
  TableContainer,
  TableCell,
  TableBody,
  Table,
  Input,
} from "@mui/material";
import axios from "axios";

import { useAuth } from "../contexts/AuthContext";
import { useAlert } from "../contexts/AlertContext";

function createData(_id, name, vendor) {
  return { _id, name, vendor };
}

export default function ResourcesTable({ resources, setResources }) {
  const { user } = useAuth();
  const { showAlert } = useAlert();

  const [editMode, setEditMode] = React.useState(false);
  const [newResource, setNewResource] = React.useState({
    name: "Solar",
    vendor: user?._id,
  });

  const handleRemoveResource = async (id) => {
    try {
      await axios.delete(`/api/resource?id=${id}`);
      setResources(resources.filter((resource) => resource._id !== id));
      showAlert("Resource removed successfully", "success");
    } catch (err) {
      console.log("err", err);
      showAlert("Failed to remove resource", "error");
    }
  };

  const rows = resources.map((r) => createData(r._id, r.name, r.vendor));

  return (
    <TableContainer component={Paper} sx={{ width: "50%" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="right"></TableCell>
            <TableCell>Id</TableCell>
            <TableCell align="right">Name</TableCell>
            <TableCell align="right">Vendor</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="right"></TableCell>
              <TableCell component="th" scope="row">
                {row._id}
              </TableCell>
              <TableCell align="right">{row.name}</TableCell>
              <TableCell align="right">{row.vendor}</TableCell>
              <TableCell align="right">
                <IconButton onClick={() => handleRemoveResource(row._id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}{" "}
          <TableRow>
            <TableCell>
              <IconButton>
                {!editMode ? (
                  <AddCircleOutlineIcon
                    onClick={() => {
                      setEditMode(true);
                    }}
                  />
                ) : (
                  <CheckCircleOutlineIcon
                    onClick={async () => {
                      setEditMode(false);
                      try {
                        const resp = await axios.post("/api/resource", {
                          resource: newResource,
                        });
                        setResources([
                          ...resources,
                          { ...newResource, _id: resp.data.resourceResult._id },
                        ]);
                        showAlert("Resource added successfully", "success");
                      } catch (err) {
                        console.log("err", err);
                        showAlert("Failed to add resource", "error");
                      }
                    }}
                  />
                )}
              </IconButton>
            </TableCell>
            <TableCell component="th" scope="row">
              {editMode ? (
                <Input
                  value={newResource.name}
                  onChange={(e) => {
                    setNewResource({ ...newResource, name: e.target.value });
                  }}
                ></Input>
              ) : null}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
