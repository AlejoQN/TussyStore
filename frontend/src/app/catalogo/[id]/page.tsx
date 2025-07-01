"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useUserCart } from "@/hooks/userCart";
import { useFavoritos } from "@/hooks/useFavoritos";
import axios from "axios";

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  descuento: number;
  imagen: string;
  imagenes?: string[];
  tallas: string[];
  colores: string[];
  stock: number;
  categoria: string;
}

export default function VistaProducto() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useUserCart();
  const { isFavorito, addFavorito, removeFavorito } = useFavoritos();

  const [producto, setProducto] = useState<Producto | null>(null);
  const [cantidad, setCantidad] = useState(1);
  const [talla, setTalla] = useState<string>("");
  const [tab, setTab] = useState<"descripcion" | "info">("descripcion");
  const [imgPrincipal, setImgPrincipal] = useState<string>("");
  const [relacionados, setRelacionados] = useState<Producto[]>([]);
  const [notificacion, setNotificacion] = useState<{
    tipo: "success" | "error";
    mensaje: string;
  } | null>(null);

  // Mostrar notificación temporal
  const showNotificacion = (tipo: "success" | "error", mensaje: string) => {
    setNotificacion({ tipo, mensaje });
    setTimeout(() => setNotificacion(null), 2000);
  };

  useEffect(() => {
    if (!id) return;
    axios.get(`/api/productos/${id}`).then((res) => {
      const p = res.data;
      // Forzar imágenes desde /uploads si no son absolutas
      const getImgUrl = (img: string) =>
        img
          ? img.startsWith("http")
            ? img
            : `/uploads/${img.replace(/^\/?uploads\//, "")}`
          : "/img/no-image.png";
      setProducto({
        ...p,
        imagen: getImgUrl(p.imagen),
        imagenes: p.imagenes
          ? p.imagenes.map((img: string) => getImgUrl(img))
          : [getImgUrl(p.imagen)],
        tallas:
          typeof p.tallas === "string"
            ? p.tallas.split(",").map((t: string) => t.trim())
            : Array.isArray(p.tallas)
            ? p.tallas
            : [],
        colores:
          typeof p.colores === "string"
            ? p.colores.split(",").map((c: string) => c.trim())
            : [],
      });
      setImgPrincipal(getImgUrl(p.imagen));
      setTalla(
        typeof p.tallas === "string" ? p.tallas.split(",")[0]?.trim() || "" : ""
      );
    });
  }, [id]);

  useEffect(() => {
    if (producto) {
      axios
        .get(
          `/api/productos/relacionados?categoria=${producto.categoria}&exclude=${producto.id}`
        )
        .then((res) => {
          const getImgUrl = (img: string) =>
            img
              ? img.startsWith("http")
                ? img
                : `/uploads/${img.replace(/^\/?uploads\//, "")}`
              : "/img/no-image.png";
          setRelacionados(
            res.data.items.map((prod: any) => ({
              ...prod,
              imagen: getImgUrl(prod.imagen),
            }))
          );
        })
        .catch(() => setRelacionados([]));
    }
  }, [producto]);

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

  // Acciones con notificación
  const handleToggleFavorito = async () => {
    if (isFavorito(producto.id)) {
      await removeFavorito(producto.id);
      showNotificacion("success", "Producto eliminado de favoritos");
    } else {
      await addFavorito(producto.id);
      showNotificacion("success", "Producto agregado a favoritos");
    }
  };

  const handleAddToCart = () => {
    addToCart({
      producto_id: producto.id,
      nombre: producto.nombre,
      imagen: producto.imagen,
      talla,
      color: producto.colores?.[0] || "",
      precio: producto.precio,
      cantidad,
      stock: producto.stock,
    });
    showNotificacion("success", "Producto agregado al carrito");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Header />
      {/* Notificación */}
      {notificacion && (
        <div
          className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded shadow-lg font-semibold ${
            notificacion.tipo === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {notificacion.mensaje}
        </div>
      )}
      <main className="flex-1 max-w-5xl mx-auto px-2 sm:px-4 py-4 md:py-8 w-full bg-white">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-500 mb-4 flex items-center gap-2">
          <span
            className="cursor-pointer hover:underline"
            onClick={() => router.push("/catalogo")}
          >
            Catálogo
          </span>
          <span>/</span>
          <span className="font-semibold">{producto.nombre}</span>
        </nav>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Galería de imágenes */}
          <div className="flex-1 flex flex-col items-center">
            <img
              src={imgPrincipal || "/img/no-image.png"}
              alt={producto.nombre}
              className="w-full max-w-xs h-72 object-contain rounded shadow border border-gray-200 mb-4 bg-gray-50"
              onError={(e) => (e.currentTarget.src = "/img/no-image.png")}
            />
            <div className="flex gap-2 w-full justify-center">
              {(producto.imagenes || [producto.imagen]).map((img, i) => (
                <img
                  key={i}
                  src={img || "/img/no-image.png"}
                  alt={`miniatura-${i}`}
                  className={`w-16 h-16 object-contain rounded border cursor-pointer bg-gray-100 ${
                    imgPrincipal === img ? "border-black" : "border-gray-200"
                  }`}
                  onClick={() => setImgPrincipal(img)}
                  onError={(e) => (e.currentTarget.src = "/img/no-image.png")}
                />
              ))}
            </div>
          </div>
          {/* Info producto */}
          <div className="flex-1 flex flex-col gap-4 bg-gray-50 rounded-lg p-6 border border-gray-200 shadow text-black">
            <div className="flex justify-between items-start">
              <h1 className="text-lg md:text-2xl font-bold">
                {producto.nombre}
              </h1>
              <button
                className="p-2"
                aria-label="Favorito"
                onClick={handleToggleFavorito}
              >
                <img
                  src={
                    isFavorito(producto.id)
                      ? "/img/iconos/favorito-lleno.svg"
                      : "/img/iconos/favorito.svg"
                  }
                  alt="Favorito"
                  className="w-7 h-7"
                />
              </button>
            </div>
            <div className="text-black">{producto.descripcion}</div>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-lg md:text-xl font-semibold text-black">
                {/* Solo muestra el precio, nunca "Precio no disponible" */}$
                {producto.precio.toLocaleString("es-CO")}
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
                onClick={handleToggleFavorito}
              >
                <img
                  src={
                    isFavorito(producto.id)
                      ? "/img/iconos/favorito-lleno.svg"
                      : "/img/iconos/favorito.svg"
                  }
                  alt="Favorito"
                  className="w-6 h-6"
                />
              </button>
            </div>
            {/* Botón agregar al carrito */}
            <button
              className="bg-black text-white px-6 py-2 rounded font-semibold w-full"
              disabled={producto.stock === 0}
              onClick={handleAddToCart}
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
            <div className="mt-2 text-gray-700">{producto.descripcion}</div>
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
              ? producto.descripcion
              : "Composición: 100% algodón. Cuidados: lavar a mano, no usar blanqueador. Hecho en Colombia."}
          </div>
        </div>
        {/* Productos relacionados */}
        <div className="mt-12">
          <h3 className="text-xl font-bold mb-4">Productos Relacionados</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {relacionados.map((prod, idx) => (
              <div
                key={`${prod.id}-${idx}`}
                className="cursor-pointer"
                onClick={() => router.push(`/catalogo/${prod.id}`)}
              >
                <div className="bg-gray-50 rounded border border-gray-200 flex flex-col items-center p-4 shadow">
                  <img
                    src={prod.imagen || "/img/no-image.png"}
                    alt={prod.nombre}
                    className="w-28 h-28 object-contain mb-2"
                    onError={(e) => (e.currentTarget.src = "/img/no-image.png")}
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
