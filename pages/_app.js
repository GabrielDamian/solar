import Sidebar from "../components/Sidebar";
import { AlertProvider } from "../contexts/AlertContext";
import { AuthProvider } from "../contexts/AuthContext";

function MyApp({ Component, pageProps }) {
  return (
    <AlertProvider>
      <AuthProvider>
        <div style={{ display: "flex", height: "100vh" }}>
          {/* Sidebar Menu */}
          {/* <Sidebar /> */}
          {/* Main Content */}
          <div style={{ flex: 1, padding: "20px" }}>
            <Component {...pageProps} />
          </div>
        </div>
      </AuthProvider>
    </AlertProvider>
  );
}

export default MyApp;
