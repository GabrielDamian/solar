import Sidebar from "../components/Sidebar";
import { AlertProvider } from "../contexts/AlertContext";
import { AuthProvider } from "../contexts/AuthContext";
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <>
    <Head>
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
      </Head>
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
    </>
   
  );
}

export default MyApp;
