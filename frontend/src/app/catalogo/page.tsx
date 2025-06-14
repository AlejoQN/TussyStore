"use client";
import React, { useState, useEffect } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useUserCart } from "@/hooks/userCart";
import { useFavoritos } from "@/hooks/useFavoritos";
import axios from "axios";
import ProductCard from "@/components/products/productCard";
import { useRouter } from "next/navigation";

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  descuento: number;
  imagen: string;
  stock: number;
  tallas?: string[];
  colores?: string[];
}

const PAGE_SIZE = 12;
const PRECIO_MIN = 0;
const PRECIO_MAX = 400000;

export default function CatalogoPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [precioMin, setPrecioMin] = useState(PRECIO_MIN);
  const [precioMax, setPrecioMax] = useState(PRECIO_MAX);
  const [pagina, setPagina] = useState(1);

  const { addToCart } = useUserCart();
  const { favoritos, addFavorito, removeFavorito, isFavorito } = useFavoritos();
  const router = useRouter();

  useEffect(() => {
    axios.get("/api/productos").then((res) => {
      setProductos(
        (res.data.items || []).map((p: any) => ({
          ...p,
          imagen: p.imagen
            ? p.imagen.startsWith("http")
              ? p.imagen
              : `/uploads/${p.imagen.replace(/^\/?uploads\//, "")}`
            : "/img/no-image.png",
          precio: Number(p.precio),
          descuento: Number(p.descuento) || 0,
        }))
      );
    });
  }, []);

  // Filtro por nombre y precio
  const productosFiltrados = productos.filter((p) => {
    const matchBusqueda =
      busqueda.trim() === "" ||
      p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const matchPrecioMin = p.precio >= precioMin;
    const matchPrecioMax = p.precio <= precioMax;
    return matchBusqueda && matchPrecioMin && matchPrecioMax;
  });

  const totalPaginas = Math.ceil(productosFiltrados.length / PAGE_SIZE);
  const productosPagina = productosFiltrados.slice(
    (pagina - 1) * PAGE_SIZE,
    pagina * PAGE_SIZE
  );

  // Slider handlers
  const handleSliderMin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), precioMax - 1000);
    setPrecioMin(value);
    setPagina(1);
  };
  const handleSliderMax = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), precioMin + 1000);
    setPrecioMax(value);
    setPagina(1);
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <Header />
      <main className="max-w-7xl mx-auto px-2 py-8 w-full flex flex-col">
        {/* Fila de búsqueda y filtro de precio */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="border rounded px-3 py-2 w-full md:w-64"
          />
          {/* Filtro de precio deslizante */}
          <div className="flex flex-col items-start">
            <span className="font-semibold text-base mb-1">
              Filtrar por precio
            </span>
            <span className="text-sm mb-2">
              Precio: ${precioMin.toLocaleString("es-CO")} - $
              {precioMax.toLocaleString("es-CO")}
            </span>
            <div className="relative w-64">
              {/* Slider doble */}
              <input
                type="range"
                min={PRECIO_MIN}
                max={PRECIO_MAX}
                value={precioMin}
                onChange={handleSliderMin}
                className="w-full h-2 bg-gray-200 rounded appearance-none z-10 mb-2"
                style={{ accentColor: "#000" }}
              />
              <input
                type="range"
                min={PRECIO_MIN}
                max={PRECIO_MAX}
                value={precioMax}
                onChange={handleSliderMax}
                className="w-full h-2 bg-gray-200 rounded appearance-none z-10"
                style={{ accentColor: "#000" }}
              />
            </div>
          </div>
        </div>
        {/* Grid de productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {productosPagina.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-12">
              No se encontraron productos.
            </div>
          ) : (
            productosPagina.map((p) => (
              <div
                key={p.id}
                className="cursor-pointer"
                onClick={() => router.push(`/catalogo/${p.id}`)}
              >
                <ProductCard
                  nombre={p.nombre}
                  imagen={p.imagen}
                  precio={p.precio}
                  descuento={p.descuento}
                  descripcion={p.descripcion}
                  favorito={isFavorito(p.id)}
                  onToggleFavorite={(e) => {
                    e?.stopPropagation?.();
                    isFavorito(p.id) ? removeFavorito(p.id) : addFavorito(p.id);
                  }}
                  onAddToCart={(e) => {
                    e?.stopPropagation?.();
                    addToCart({
                      producto_id: p.id,
                      nombre: p.nombre,
                      imagen: p.imagen,
                      precio: p.precio,
                      cantidad: 1,
                      talla: "",
                      color: "",
                      stock: p.stock,
                    });
                  }}
                />
              </div>
            ))
          )}
        </div>
        {/* Paginación */}
        {totalPaginas > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              className="px-3 py-1 rounded border"
              disabled={pagina === 1}
              onClick={() => setPagina((p) => p - 1)}
            >
              &lt;
            </button>
            {Array.from({ length: totalPaginas }).map((_, i) => (
              <button
                key={i}
                className={`px-3 py-1 rounded border ${
                  pagina === i + 1 ? "bg-black text-white" : ""
                }`}
                onClick={() => setPagina(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="px-3 py-1 rounded border"
              disabled={pagina === totalPaginas}
              onClick={() => setPagina((p) => p + 1)}
            >
              &gt;
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
