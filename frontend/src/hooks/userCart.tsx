"use client";
import { useState, useEffect } from "react";

export type CartItem = {
  id: number;
  producto_id: number;
  nombre: string;
  imagen: string;
  talla?: string;
  color?: string;
  precio: number;
  cantidad: number;
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

export function useUserCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  // Cargar carrito de localStorage al montar
  useEffect(() => {
    setItems(getStoredCart());
  }, []);

  // Guardar carrito en localStorage cada vez que cambie
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items]);

  // Añadir al carrito
  const addToCart = (item: Omit<CartItem, "id">) => {
    setItems((prev) => {
      const idx = prev.findIndex(
        (i) =>
          i.producto_id === item.producto_id &&
          i.talla === item.talla &&
          i.color === item.color
      );
      if (idx !== -1) {
        // Ya existe, sumar cantidad
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          cantidad: updated[idx].cantidad + item.cantidad,
        };
        return updated;
      }
      // Nuevo item
      return [
        ...prev,
        {
          ...item,
          id: Date.now(),
        },
      ];
    });
  };

  // Eliminar del carrito
  const removeFromCart = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Actualizar cantidad
  const updateQuantity = (id: number, cantidad: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, cantidad: Math.max(1, cantidad) } : i
      )
    );
  };

  return {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
  };
}
