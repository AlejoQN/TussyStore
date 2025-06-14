"use client";
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type User = {
  id: number;
  nombre: string;
  email: string;
  rol?: string;
  foto?: string;
  telefono?: string;
  direccion?: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: any) => Promise<void>;
  loading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: async () => {},
  logout: () => {},
  register: async () => {},
  loading: true,
  setUser: () => {},
  setToken: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Cargar usuario y token desde localStorage al iniciar
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
      localStorage.removeItem("tussy_cart");
    }
  }, [token, user]);

  // Login
  const login = async (email: string, password: string) => {
    const response = await axios.post("/api/auth/login", { email, password });
    const { user, token } = response.data;
    setUser(user);
    setToken(token);
    localStorage.setItem("tussy_token", token);
    localStorage.setItem("tussy_user", JSON.stringify(user));
    localStorage.removeItem("tussy_cart"); // Limpia el carrito local antes de cargar el del usuario autenticado
  };

  // Logout
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("tussy_token");
    localStorage.removeItem("tussy_user");
    localStorage.removeItem("tussy_cart"); // Limpia el carrito local
    router.push("/"); // Redirige a la homepage
  };

  // Register
  const register = async (form: any) => {
    await axios.post("/api/auth/register", form);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        register,
        loading,
        setUser,
        setToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook para acceder fácilmente al contexto
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
