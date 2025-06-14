"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export type CartItem = {
  id: number; // id único del item en el carrito
  producto_id: number;
  nombre: string;
  imagen: string;
  precio: number;
  cantidad: number;
  talla?: string;
  color?: string;
  stock: number;
};

const STORAGE_KEY = "tussy_cart";

function getStoredCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function useUserCart(userToken?: string) {
  const [items, setItems] = useState<CartItem[]>(getStoredCart());

  // Persistencia en localStorage para invitados
  useEffect(() => {
    if (!userToken && typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, userToken]);

  // Sincronizar con backend al iniciar sesión
  useEffect(() => {
    if (userToken) {
      axios
        .get("/api/cart", {
          headers: { Authorization: `Bearer ${userToken}` },
        })
        .then((res) => {
          if (Array.isArray(res.data.items)) setItems(res.data.items);
        })
        .catch(() => {});
    }
  }, [userToken]);

  // Añadir al carrito
  const addToCart = async (item: Omit<CartItem, "id">) => {
    if (userToken) {
      await axios.post(
        "/api/cart/add",
        {
          producto_id: item.producto_id,
          cantidad: item.cantidad,
          talla: item.talla,
          color: item.color,
        },
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );
      const res = await axios.get("/api/cart", {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      setItems(res.data.items);
    } else {
      setItems((prev) => {
        const idx = prev.findIndex(
          (i) =>
            i.producto_id === item.producto_id &&
            i.talla === item.talla &&
            i.color === item.color
        );
        if (idx !== -1) {
          const updated = [...prev];
          updated[idx] = {
            ...updated[idx],
            cantidad: Math.min(
              updated[idx].cantidad + item.cantidad,
              updated[idx].stock
            ),
          };
          return updated;
        }
        return [
          ...prev,
          {
            ...item,
            id: Date.now(),
          },
        ];
      });
    }
  };

  // Eliminar del carrito por ID
  const removeFromCart = async (id: number) => {
    if (userToken) {
      await axios.delete(`/api/cart/item/${id}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      const res = await axios.get("/api/cart", {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      setItems(res.data.items);
    } else {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Modificar cantidad de un producto
  const updateQuantity = async (id: number, cantidad: number) => {
    if (cantidad < 1) return;
    const item = items.find((i) => i.id === id);
    if (!item) return;
    if (userToken) {
      await axios.put(
        `/api/cart/update/${id}`,
        { cantidad },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      const res = await axios.get("/api/cart", {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      setItems(res.data.items);
    } else {
      setItems((prev) =>
        prev.map((i) =>
          i.id === id
            ? { ...i, cantidad: Math.max(1, Math.min(cantidad, i.stock)) }
            : i
        )
      );
    }
  };

  return {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    setItems,
  };
}
