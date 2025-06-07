"use client";
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

type User = {
  id: number;
  nombre: string;
  email: string;
  rol?: string;
  foto?: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: any) => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const t = localStorage.getItem("tussy_token");
    const u = localStorage.getItem("tussy_user");
    if (t && u) {
      setToken(t);
      setUser(JSON.parse(u));
    }
    setLoading(false);
  }, []);

  // Guardar en localStorage cuando cambie
  useEffect(() => {
    if (token && user) {
      localStorage.setItem("tussy_token", token);
      localStorage.setItem("tussy_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("tussy_token");
      localStorage.removeItem("tussy_user");
    }
  }, [token, user]);

  // Login
  const login = async (email: string, password: string) => {
    const { data } = await axios.post("/api/auth/login", { email, password });
    setToken(data.token);
    setUser(data.user);
  };

  // Logout
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("tussy_token");
    localStorage.removeItem("tussy_user");
  };

  // Register
  const register = async (form: any) => {
    await axios.post("/api/auth/register", form);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, register, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
