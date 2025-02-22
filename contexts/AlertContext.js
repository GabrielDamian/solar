import React, { createContext, useState, useContext } from "react";
import { Alert, Stack } from "@mui/material";

const AlertContext = createContext();

export const useAlert = () => {
  return useContext(AlertContext);
};

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({ message: "", type: "" });

  const showAlert = (message, type = "info") => {
    setAlert({ message, type });
    setTimeout(() => {
      setAlert({ message: "", type: "" });
    }, 3000);
  };

  return (
    <AlertContext.Provider value={{ alert, showAlert }}>
      <Stack sx={{ width: "100%" }} spacing={2}>
        {alert.type === "success" && (
          <Alert severity="success">{alert.message}</Alert>
        )}
        {alert.type === "info" && (
          <Alert severity="info">{alert.message}</Alert>
        )}
        {alert.type === "warning" && (
          <Alert severity="warning">{alert.message}</Alert>
        )}
        {alert.type === "error" && (
          <Alert severity="error">{alert.message}</Alert>
        )}
      </Stack>
      {children}
    </AlertContext.Provider>
  );
};
