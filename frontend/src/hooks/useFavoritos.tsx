import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

export function useFavoritos() {
  const { token } = useAuth();
  const [favoritos, setFavoritos] = useState<number[]>([]); // IDs de productos favoritos

  useEffect(() => {
    if (!token) return;
    axios
      .get("/api/favoritos", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setFavoritos(res.data.favoritos.map((f: any) => f.id)))
      .catch(() => setFavoritos([]));
  }, [token]);

  const addFavorito = async (productoId: number) => {
    if (!token) return;
    await axios.post(
      "/api/favoritos",
      { productoId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setFavoritos((prev) => [...prev, productoId]);
  };

  const removeFavorito = async (productoId: number) => {
    if (!token) return;
    await axios.delete(`/api/favoritos/${productoId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setFavoritos((prev) => prev.filter((id) => id !== productoId));
  };

  const isFavorito = (productoId: number) => favoritos.includes(productoId);

  return { favoritos, addFavorito, removeFavorito, isFavorito };
}
