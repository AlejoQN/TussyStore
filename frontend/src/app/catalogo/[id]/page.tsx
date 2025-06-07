"use client";
import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { mockProductos } from "../page";
import { useUserCart } from "@/hooks/userCart";

export default function VistaProducto() {
  const params = useParams();
  const id = Number(params.id);
  const producto = mockProductos.find(
    (p: (typeof mockProductos)[number]) => p.id === id
  );
  const [talla, setTalla] = useState(producto?.tallas[0] || "");
  const [cantidad, setCantidad] = useState(1);
  const [favorito, setFavorito] = useState(false);
  const [tab, setTab] = useState<"descripcion" | "info">("descripcion");
  const router = useRouter();
  const { addToCart } = useUserCart();

  if (!producto) {
    return (
      <div>
        <Header />
        <main className="p-8 text-center text-red-500">
          Producto no encontrado
        </main>
        <Footer />
      </div>
    );
  }

  // Simulación de galería (si tuvieras más imágenes, agrégalas aquí)
  const imagenes = [
    producto.imagen,
    producto.imagen,
    producto.imagen,
    producto.imagen,
  ];

  // Productos relacionados
  const relacionados = mockProductos
    .filter(
      (p: (typeof mockProductos)[number]) =>
        p.categoria === producto.categoria && p.id !== producto.id
    )
    .slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Header />
      <main className="flex-1 max-w-md md:max-w-6xl mx-auto px-2 sm:px-4 py-4 md:py-8 w-full">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-500 mb-4 flex items-center gap-2">
          <span
            className="cursor-pointer hover:underline"
            onClick={() => router.push("/catalogo")}
          >
            Catálogo
          </span>
          <span>/</span>
          <span
            className="cursor-pointer hover:underline"
            onClick={() => router.push(`/catalogo?cat=${producto.categoria}`)}
          >
            {producto.categoria}
          </span>
          <span>/</span>
          <span className="font-semibold">{producto.nombre}</span>
        </nav>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Galería de imágenes */}
          <div className="flex-1 flex flex-col items-center">
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="w-full max-w-xs h-72 object-contain rounded shadow mb-4"
            />
            <div className="flex gap-2 w-full justify-center">
              {imagenes.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`miniatura-${i}`}
                  className="w-16 h-16 object-contain rounded border cursor-pointer"
                />
              ))}
            </div>
          </div>
          {/* Info producto */}
          <div className="flex-1 flex flex-col gap-4">
            <h1 className="text-lg md:text-2xl font-bold">{producto.nombre}</h1>
            <div className="text-gray-700">{producto.descripcion}</div>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-lg md:text-xl font-semibold text-black">
                ${producto.precio.toLocaleString("es-CO")}
              </span>
              {producto.descuento > 0 && (
                <>
                  <span className="line-through text-gray-400 text-base md:text-lg">
                    $
                    {(
                      producto.precio /
                      (1 - producto.descuento / 100)
                    ).toLocaleString("es-CO")}
                  </span>
                  <span className="bg-primary text-white px-2 py-1 rounded text-xs">
                    -{producto.descuento}%
                  </span>
                </>
              )}
            </div>
            {/* Tallas */}
            <div>
              <label className="font-medium mr-2">Tallas</label>
              <div className="flex gap-2 mt-1">
                {producto.tallas.map((t: string) => (
                  <button
                    key={t}
                    className={`px-3 py-1 border rounded w-10 ${
                      talla === t ? "bg-black text-white" : "bg-white"
                    }`}
                    onClick={() => setTalla(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            {/* Cantidad y Favorito */}
            <div className="flex gap-2 mt-2">
              <input
                type="number"
                min={1}
                max={producto.stock}
                value={cantidad}
                onChange={(e) => setCantidad(Number(e.target.value))}
                className="border rounded px-2 py-1 w-16"
              />
              <button
                className="px-4 py-2 rounded border flex items-center justify-center"
                onClick={() => setFavorito((f) => !f)}
                aria-label="Favorito"
              >
                <span
                  className={
                    favorito ? "text-red-500 text-xl" : "text-gray-400 text-xl"
                  }
                >
                  {favorito ? "❤️" : "🤍"}
                </span>
              </button>
            </div>
            {/* Botón agregar al carrito */}
            <button
              className="bg-black text-white px-6 py-2 rounded font-semibold w-full"
              disabled={producto.stock === 0}
              onClick={() =>
                addToCart({
                  producto_id: producto.id,
                  nombre: producto.nombre,
                  imagen: producto.imagen,
                  talla,
                  color: producto.colores[0],
                  precio: producto.precio,
                  cantidad,
                  stock: producto.stock,
                })
              }
            >
              {producto.stock === 0 ? "Sin stock" : "Añadir al carrito"}
            </button>
            {/* Stock */}
            <div className="text-xs text-gray-500 mt-1">
              Stock disponible: {producto.stock}
            </div>
          </div>
        </div>
        {/* Tabs descripción/info como acordeón en móvil */}
        <div className="mt-8">
          <details open={tab === "descripcion"} className="mb-2 md:hidden">
            <summary
              className="font-semibold cursor-pointer"
              onClick={() => setTab("descripcion")}
            >
              Descripción
            </summary>
            <div className="mt-2 text-gray-700">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
              commodo magna facilisis, feugiat enim eu, bibendum neque.
            </div>
          </details>
          <details open={tab === "info"} className="md:hidden">
            <summary
              className="font-semibold cursor-pointer"
              onClick={() => setTab("info")}
            >
              Información adicional del producto
            </summary>
            <div className="mt-2 text-gray-700">
              Composición: 100% algodón. Cuidados: lavar a mano, no usar
              blanqueador. Hecho en Colombia.
            </div>
          </details>
          {/* Tabs normales en desktop */}
          <div className="hidden md:flex border-b gap-8">
            <button
              className={`pb-2 border-b-2 ${
                tab === "descripcion"
                  ? "border-black font-semibold"
                  : "border-transparent"
              }`}
              onClick={() => setTab("descripcion")}
            >
              Descripción
            </button>
            <button
              className={`pb-2 border-b-2 ${
                tab === "info"
                  ? "border-black font-semibold"
                  : "border-transparent"
              }`}
              onClick={() => setTab("info")}
            >
              Información adicional del producto
            </button>
          </div>
          <div className="hidden md:block mt-4 text-gray-700 min-h-[60px]">
            {tab === "descripcion"
              ? "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam commodo magna facilisis, feugiat enim eu, bibendum neque."
              : "Composición: 100% algodón. Cuidados: lavar a mano, no usar blanqueador. Hecho en Colombia."}
          </div>
        </div>
        {/* Productos relacionados */}
        <div className="mt-12">
          <h3 className="text-xl font-bold mb-4">Productos Relacionados</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {relacionados.map((prod: (typeof mockProductos)[number]) => (
              <div
                key={prod.id}
                className="cursor-pointer"
                onClick={() => router.push(`/catalogo/${prod.id}`)}
              >
                <div className="bg-gray-100 rounded flex flex-col items-center p-4">
                  <img
                    src={prod.imagen}
                    alt={prod.nombre}
                    className="w-28 h-28 object-contain mb-2"
                  />
                  <div className="font-semibold">{prod.nombre}</div>
                  <div className="text-sm text-gray-600">
                    {prod.descripcion}
                  </div>
                  <div className="font-bold mt-1">
                    ${prod.precio.toLocaleString("es-CO")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
