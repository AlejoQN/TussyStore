"use client";
import React, { useState } from "react";
import { useFavoritos } from "@/hooks/useFavoritos";

type ProductCardProps = {
  id: number;
  nombre: string;
  imagen: string;
  precio: number;
  precioTachado?: number;
  descuento?: number;
  masVendido?: boolean;
  descripcion: string;
  onAddToCart?: () => void;
};

export default function ProductCard({
  id,
  nombre,
  imagen,
  precio,
  precioTachado,
  descuento,
  masVendido,
  descripcion,
  onAddToCart,
}: ProductCardProps) {
  const { isFavorito, addFavorito, removeFavorito } = useFavoritos();
  const [hover, setHover] = useState(false);
  const favorito = isFavorito(id);

  // Agregar al carrito
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart && onAddToCart();
  };

  // Animación y cambio de favorito
  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (favorito) {
      removeFavorito(id);
    } else {
      addFavorito(id);
    }
  };

  return (
    <div
      className="relative bg-gray-100 rounded shadow flex flex-col items-center p-4 transition-all duration-200 hover:shadow-lg min-h-[320px] cursor-pointer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Corazón favoritos */}
      <button
        className="absolute top-3 right-3 z-10"
        onClick={handleFavorite}
        aria-label="Agregar a favoritos"
      >
        {favorito ? (
          <img
            src="/img/iconos/favorito-lleno.svg"
            alt="Favorito"
            className="h-7 w-7"
            style={{ filter: "drop-shadow(0 0 2px #fff)" }}
          />
        ) : (
          <img
            src="/img/iconos/favorito.svg"
            alt="Agregar a favoritos"
            className="h-7 w-7"
          />
        )}
      </button>

      {/* Imagen */}
      <img
        src={imagen}
        alt={nombre}
        className="w-36 h-36 object-contain mb-4"
        draggable={false}
      />

      {/* Botón agregar al carrito (solo en hover) */}
      {hover && (
        <button
          className="absolute left-1/2 -translate-x-1/2 bottom-28 bg-white text-black px-4 py-2 rounded shadow font-medium transition hover:bg-primary hover:text-white"
          onClick={handleAddToCart}
        >
          Agregar al Carrito
        </button>
      )}

      {/* Nombre y descripción */}
      <div className="w-full mt-auto">
        <div className="font-bold text-base mt-2">{nombre}</div>
        <div className="text-sm text-gray-600">{descripcion}</div>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-semibold text-base">
            ${precio.toLocaleString("es-CO")}
          </span>
          {(precioTachado || descuento) && (
            <span className="text-gray-400 line-through text-sm">
              $
              {precioTachado
                ? precioTachado.toLocaleString("es-CO")
                : (precio + ((descuento ?? 0) / 100) * precio).toLocaleString(
                    "es-CO"
                  )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
