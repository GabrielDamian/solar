import { createContext, useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import axios from "axios";

// Create the AuthContext
const AuthContext = createContext();

// Provider component to wrap the app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store user info
  const [loading, setLoading] = useState(true); // Loading state
  const router = useRouter();

  // Fetch user data when the app initializes
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios("/api/auth/me"); // API to get user info
        if (!(res?.statusText === "OK")) throw new Error("Not authenticated");
        const userData = await res.data;
        setUser(userData);
      } catch (err) {
        console.log("error", err);
        setUser(null); // Not logged in
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email, password }),
      });

      if (!res.ok) throw new Error("Failed to log in");
      const userData = await res.json();
      setUser(userData); // Update user state
      router.push("/dashboard"); // Redirect to dashboard
    } catch (err) {
      console.error(err);
      throw new Error("Invalid login credentials");
    }
  };

  // Register method
  const register = async (name, email, password, role) => {
    console.log("role", role);
    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "register",
          name,
          email,
          password,
          role,
        }),
      });

      if (!res.ok) throw new Error("Failed to register");
      const userData = await res.json();
      setUser(userData); // Automatically log the user in after registration
      router.push("/dashboard"); // Redirect to dashboard
    } catch (err) {
      console.log("err2", err);
      throw new Error("Failed to register. Try again.");
    }
  };

  // Logout method
  const logout = async () => {
    try {
      await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" }),
      });
      setUser(null); // Clear user state
      router.push("/login"); // Redirect to login
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
