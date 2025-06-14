"use client";

import { createContext, useContext, useState } from "react";

const AuthContext = createContext<any>(null);

// Provider para envolver la aplicación y proporcionar el contexto de autenticación
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  // ...aquí tu lógica de login/logout...

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para acceder fácilmente a la autenticación en cualquier componente
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
