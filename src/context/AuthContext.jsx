import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // user object
  const [token, setToken] = useState(null);     // JWT token

  // ---------------------
  // LOGIN
  // ---------------------
  const login = (jwt, userData) => {
    setToken(jwt);
    setUser(userData);

    // persist in localStorage
    localStorage.setItem("token", jwt);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // ---------------------
  // SIGNUP (same as login)
  // ---------------------
  const signup = (userData) => {
    setUser(userData);

    // NOTE: token will be set only after login
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // ---------------------
  // LOGOUT
  // ---------------------
  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
    if (typeof window !== "undefined") window.location.href = "/login";
  };

  // ---------------------
  // Restore session
  // ---------------------
  const storedToken = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  if (!user && storedUser) {
    setUser(JSON.parse(storedUser));
  }
  if (!token && storedToken) {
    setToken(storedToken);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
