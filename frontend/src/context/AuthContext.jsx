import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const API = "/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const stored = localStorage.getItem("admin");
      if (token && stored) {
        const parsed = JSON.parse(stored);
        if (parsed && (parsed.role === "admin" || parsed.role === "student")) {
          setAdmin(parsed);
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("admin");
        }
      }
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("admin");
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await axios.post(`${API}/auth/login`, { email, password });
    localStorage.setItem("token", data.token);
    localStorage.setItem("admin", JSON.stringify(data));
    setAdmin(data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    setAdmin(null);
  };

  const getToken = () => localStorage.getItem("token");

  const authAxios = axios.create({ baseURL: API });
  authAxios.interceptors.request.use((config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, authAxios, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};
