import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";

export function useFavoritos() {
  const { token } = useAuth();
  const [favoritos, setFavoritos] = useState<number[]>([]);

  useEffect(() => {
    const fetchFavoritos = async () => {
      if (!token) {
        setFavoritos([]);
        return;
      }
      try {
        const res = await axios.get("/api/favoritos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavoritos(res.data.favoritos.map((f: { id: number }) => f.id));
      } catch (err) {
        setFavoritos([]);
      }
    };
    fetchFavoritos();
  }, [token]);

  const addFavorito = async (productoId: number) => {
    if (!token) return;
    await axios.post(
      "/api/favoritos",
      { productoId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    await fetchFavoritos();
  };

  const removeFavorito = async (productoId: number) => {
    if (!token) return;
    await axios.delete(`/api/favoritos/${productoId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    await fetchFavoritos();
  };

  const isFavorito = (productoId: number) => favoritos.includes(productoId);

  return { favoritos, addFavorito, removeFavorito, isFavorito };
}
