import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { apiPost, apiGetAuth } from "../api/api";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const loginRes = await apiPost("/auth/login", data);
      const token = loginRes.access_token;

      const user = await apiGetAuth("/auth/me", token);

      login(token, user);

      navigate("/dashboard");
    } catch (error) {
      alert("Invalid email or password");
    }
  };

  const pageStyle = {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const cardStyle = {
    width: "100%",
    maxWidth: "380px",
    padding: "2rem",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    backgroundColor: "#fff",
  };

  const fieldStyle = {
    display: "flex",
    flexDirection: "column",
    marginBottom: "1rem",
  };

  const labelStyle = {
    marginBottom: "0.25rem",
    fontWeight: "600",
  };

  const inputStyle = {
    padding: "0.5rem 0.75rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "0.95rem",
  };

  const errorStyle = {
    color: "red",
    fontSize: "0.8rem",
    marginTop: "0.25rem",
  };

  const buttonStyle = {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "4px",
    border: "none",
    fontWeight: "600",
    cursor: "pointer",
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          Login
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div style={fieldStyle}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              style={inputStyle}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
            />
            {errors.email && (
              <span style={errorStyle}>{errors.email.message}</span>
            )}
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              style={inputStyle}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.password && (
              <span style={errorStyle}>{errors.password.message}</span>
            )}
          </div>

          <button type="submit" style={buttonStyle}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
