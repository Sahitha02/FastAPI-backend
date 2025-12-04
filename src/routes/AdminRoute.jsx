import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user } = useAuth();

  // Not logged in
  if (!user) return <Navigate to="/login" />;

  // Logged in but not admin
  if (user.role !== "admin") return <Navigate to="/dashboard" />;

  // Admin allowed
  return children;
}
