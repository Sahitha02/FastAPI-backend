import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { apiPost, apiGetAuth } from "../api/api";  

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const passwordValue = watch("password");
  // const { signup } = useAuth();
  const { login } = useAuth();
  const navigate = useNavigate();


const onSubmit = async (data) => {
  try {
    // 1️⃣ Create user
    await apiPost("/auth/signup", {
      full_name: data.fullName,
      email: data.email,
      phone: data.phone,
      password: data.password
    });

    // 2️⃣ Login automatically
    const loginRes = await apiPost("/auth/login", {
      email: data.email,
      password: data.password
    });

    const token = loginRes.access_token;

    // 3️⃣ Get user data with token
    const user = await apiGetAuth("/auth/me", token);

    // 4️⃣ Save to AuthContext
    login(token, {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      phone: user.phone,
      role: user.role
    });

    // 5️⃣ Redirect
    navigate("/dashboard");

  } catch (error) {
    alert("Signup failed: " + error.message);
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
    maxWidth: "420px",
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
          Create an Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Full Name */}
          <div style={fieldStyle}>
            <label style={labelStyle} htmlFor="fullName">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              style={inputStyle}
              {...register("fullName", {
                required: "Full name is required",
                minLength: {
                  value: 3,
                  message: "Full name must be at least 3 characters",
                },
              })}
            />
            {errors.fullName && (
              <span style={errorStyle}>{errors.fullName.message}</span>
            )}
          </div>

          {/* Email */}
          <div style={fieldStyle}>
            <label style={labelStyle} htmlFor="email">
              Email
            </label>
            <input
              id="email"
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

          {/* Phone Number */}
          <div style={fieldStyle}>
            <label style={labelStyle} htmlFor="phone">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              style={inputStyle}
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Phone must be 10 digits",
                },
              })}
            />
            {errors.phone && (
              <span style={errorStyle}>{errors.phone.message}</span>
            )}
          </div>

          {/* Password */}
          <div style={fieldStyle}>
            <label style={labelStyle} htmlFor="password">
              Password
            </label>
            <input
              id="password"
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

          {/* Confirm Password */}
          <div style={fieldStyle}>
            <label style={labelStyle} htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              style={inputStyle}
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === passwordValue || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <span style={errorStyle}>{errors.confirmPassword.message}</span>
            )}
          </div>

          <button type="submit" style={buttonStyle}>
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
