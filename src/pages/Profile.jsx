import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiGet, apiDeleteAuth } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, logout } = useAuth();
  const [serverUser, setServerUser] = useState(null);
  const navigate = useNavigate();

  // Fetch user from backend
  useEffect(() => {
    if (!user?.id) return;

    apiGet(`/users/${user.id}`)
      .then((data) => {
        setServerUser(data);
      })
      .catch(() => {
        alert("Failed to load profile");
      });
  }, [user]);

  // Delete account handler
  const deleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      await apiDeleteAuth(`/users/${user.id}`, token);
      logout(); // Clear context
      alert("Account deleted successfully");
      navigate("/");
    } catch (error) {
      alert("Failed to delete account");
    }
  };

  // Loading state
  if (!serverUser) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "2rem" }}>
        Loading profile...
      </h2>
    );
  }

  // Inline styles
  const pageStyle = {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const cardStyle = {
    width: "100%",
    maxWidth: "400px",
    padding: "2rem",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
          User Profile
        </h2>

        <p>
          <strong>ID:</strong> {serverUser.id}
        </p>
        <p>
          <strong>Full Name:</strong> {serverUser.full_name}
        </p>
        <p>
          <strong>Email:</strong> {serverUser.email}
        </p>
        <p>
          <strong>Phone:</strong> {serverUser.phone || "Not Provided"}
        </p>

        <button
          onClick={() => navigate("/edit-profile")}
          style={{
            width: "100%",
            padding: "0.75rem",
            marginTop: "1rem",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Edit Profile
        </button>

        <button
          onClick={deleteAccount}
          style={{
            width: "100%",
            padding: "0.75rem",
            marginTop: "1rem",
            background: "red",
            color: "white",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}


