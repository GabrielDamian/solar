import Link from "next/link";

export default function Sidebar() {
  return (
    <div
      style={{
        width: "250px",
        backgroundColor: "#f4f4f4",
        padding: "20px",
        boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
      }}
    >
      <h2>Menu</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li style={{ marginBottom: "15px" }}>
          <Link href="/login">
            <div style={{ textDecoration: "none", color: "#333" }}>Login</div>
          </Link>
        </li>
        <li style={{ marginBottom: "15px" }}>
          <Link href="/register">
            <div style={{ textDecoration: "none", color: "#333" }}>
              Register
            </div>
          </Link>
        </li>
        <li style={{ marginBottom: "15px" }}>
          <Link href="/dashboard">
            <div style={{ textDecoration: "none", color: "#333" }}>
              Dashboard
            </div>
          </Link>
        </li>
        <li style={{ marginBottom: "15px" }}>
          <Link href="/comingsoon">
            <div style={{ textDecoration: "none", color: "#333" }}>
              Coming Soon
            </div>
          </Link>
        </li>
      </ul>
    </div>
  );
}
