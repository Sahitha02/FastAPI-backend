import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { apiGet, apiPutAuth } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const { user, token, login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // Load existing data
  useEffect(() => {
    if (!user?.id) return;

    apiGet(`/users/${user.id}`).then((data) => {
      setValue("full_name", data.full_name);
      setValue("email", data.email);
      setValue("phone", data.phone);
    });
  }, [user, setValue]);

  const onSubmit = async (formData) => {
    try {
      // Correct update call (with token)
      const updatedUser = await apiPutAuth(
        `/users/${user.id}`,
        formData,
        token
      );

      // Update AuthContext properly
      login(token, updatedUser);

      alert("Profile updated successfully!");
      navigate("/profile");
    } catch (error) {
      console.error(error);
      alert("Failed to update profile");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "2rem",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      >
        <h2>Edit Profile</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ marginBottom: "1rem" }}>
            <label>Full Name</label>
            <input
              {...register("full_name", { required: "Required" })}
              style={{ width: "100%", padding: "0.5rem" }}
            />
            {errors.full_name && (
              <p style={{ color: "red" }}>{errors.full_name.message}</p>
            )}
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label>Email</label>
            <input
              {...register("email", { required: "Required" })}
              style={{ width: "100%", padding: "0.5rem" }}
            />
            {errors.email && (
              <p style={{ color: "red" }}>{errors.email.message}</p>
            )}
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label>Phone</label>
            <input
              {...register("phone")}
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>

          <button type="submit" style={{ width: "100%", padding: "0.75rem" }}>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
