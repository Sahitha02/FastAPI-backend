import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
      <Link to="/">Home</Link>

      {!user && <Link to="/login">Login</Link>}
      {!user && <Link to="/signup">Signup</Link>}

      {user && (
        <>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/edit-profile">Edit Profile</Link>

          {/* admin-only link */}
          {user.role === "admin" && <Link to="/admin">Admin</Link>}

          <button onClick={logout}>Logout</button>
        </>
      )}
    </nav>
  );
}


