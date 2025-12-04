import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiGet } from "../api/api";

export default function Dashboard() {
  const { user } = useAuth();
  const [serverUser, setServerUser] = useState(null);

  useEffect(() => {
    if (!user?.id) return;

    apiGet(`/users/${user.id}`)
      .then(setServerUser)
      .catch(() => alert("Failed to load dashboard user"));
  }, [user]);

  if (!serverUser) return <h2>Loading dashboard...</h2>;

  return (
    <>
      <h1>Dashboard</h1>
      <p>Welcome, {serverUser.full_name}!</p>
    </>
  );
}

