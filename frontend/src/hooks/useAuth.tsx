"use client";

import { createContext, useContext, useState } from "react";
import { useAuth as useAuthOriginal } from "@/context/AuthContext";

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
export function useLocalAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useLocalAuth debe usarse dentro de AuthProvider");
  return ctx;
}

export function useUserCart() {
  const { user } = useLocalAuth();
  const cartKey = user ? `tussy_cart_${user.id}` : "tussy_cart";

  // Usa cartKey en lugar de "tussy_cart" para guardar y leer el carrito
  // ...resto del hook...
}

export { useAuthOriginal as useAuth };
