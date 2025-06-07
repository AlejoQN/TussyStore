import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

type FavoritosContextType = {
  favoritos: number[];
  addFavorito: (id: number) => Promise<void>;
  removeFavorito: (id: number) => Promise<void>;
  isFavorito: (id: number) => boolean;
};

const FavoritosContext = createContext<FavoritosContextType | undefined>(
  undefined
);

export function FavoritosProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const [favoritos, setFavoritos] = useState<number[]>([]);

  useEffect(() => {
    if (!token) return setFavoritos([]);
    axios
      .get("/api/favoritos", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setFavoritos(res.data.favoritos.map((f: any) => f.id)))
      .catch(() => setFavoritos([]));
  }, [token]);

  const addFavorito = async (id: number) => {
    await axios.post(
      "/api/favoritos",
      { productoId: id },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setFavoritos((prev) => [...prev, id]);
  };

  const removeFavorito = async (id: number) => {
    await axios.delete(`/api/favoritos/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setFavoritos((prev) => prev.filter((fid) => fid !== id));
  };

  const isFavorito = (id: number) => favoritos.includes(id);

  return (
    <FavoritosContext.Provider
      value={{ favoritos, addFavorito, removeFavorito, isFavorito }}
    >
      {children}
    </FavoritosContext.Provider>
  );
}

export function useFavoritos() {
  const ctx = useContext(FavoritosContext);
  if (!ctx)
    throw new Error("useFavoritos debe usarse dentro de FavoritosProvider");
  return ctx;
}
