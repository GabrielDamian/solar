import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Calendar from "../components/Calendar";
import VendorDashboard from "../components/VendorDashboard";

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  // Redirect unauthenticated users
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) return <p>Loading...</p>; // Show a loading state

  return (
    <div>
      <h1>Welcome to the Dashboard, {user?.name}!</h1>

      {user ? (
        user.role === "client" ? (
          <div>
            <Calendar></Calendar>
          </div>
        ) : (
          <VendorDashboard></VendorDashboard>
        )
      ) : null}

      <br />
      <br />
      <button onClick={logout}>Logout</button>
    </div>
  );
}
