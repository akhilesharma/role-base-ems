import { createContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await api.get("/auth/me");
          setUser(response.data);
        }
      } catch (error) {
        console.error("Failed to load user:", error);
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (username, password) => {
    const response = await api.post("/auth/login", { username, password });
    localStorage.setItem("token", response.data.token);
    setUser(response.data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
