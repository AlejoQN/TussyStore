"use client";
import React, { useState } from "react";

type ProductCardProps = {
  nombre: string;
  imagen: string;
  precio: number;
  precioTachado?: number;
  descuento?: number;
  masVendido?: boolean;
  descripcion: string;
  onAddToCart?: () => void;
  onToggleFavorite?: () => void;
  favorito?: boolean;
};

export default function ProductCard({
  nombre,
  imagen,
  precio,
  precioTachado,
  descuento,
  masVendido,
  descripcion,
  onAddToCart,
  onToggleFavorite,
  favorito,
}: ProductCardProps) {
  const [hover, setHover] = useState(false);

  return (
    <div
      className="relative bg-gray-100 rounded shadow flex flex-col items-center p-4 transition-all duration-200 hover:shadow-lg min-h-[320px] cursor-pointer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Corazón favoritos SVG */}
      {(hover || favorito) && (
        <button
          className="absolute top-3 right-3 z-10"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite && onToggleFavorite();
          }}
          aria-label={favorito ? "Quitar de favoritos" : "Agregar a favoritos"}
          type="button"
        >
          <img
            src={
              favorito
                ? "/img/iconos/favorito-fill.svg"
                : "/img/iconos/favorito.svg"
            }
            alt="Favorito"
            className="h-7 w-7 transition"
          />
        </button>
      )}

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
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart && onAddToCart();
          }}
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
              {precioTachado ? `$${precioTachado.toLocaleString("es-CO")}` : ""}
            </span>
          )}
          {descuento && descuento > 0 && (
            <span className="bg-primary text-white px-2 py-1 rounded text-xs">
              -{descuento}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
