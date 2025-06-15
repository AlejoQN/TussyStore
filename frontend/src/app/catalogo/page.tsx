"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserCart } from "@/hooks/userCart";
import { useFavoritos } from "@/hooks/useFavoritos";
import ProductCard from "@/components/products/ProductCard";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import axios from "axios";

const PAGE_SIZE = 12;
const PRECIO_MIN = 0;
const PRECIO_MAX = 2000000;

export default function CatalogoPage() {
  const [productos, setProductos] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [precioMin, setPrecioMin] = useState(PRECIO_MIN);
  const [precioMax, setPrecioMax] = useState(PRECIO_MAX);
  const [pagina, setPagina] = useState(1);

  const [notificacion, setNotificacion] = useState<{
    tipo: "success" | "error";
    mensaje: string;
  } | null>(null);

  const { addToCart } = useUserCart();
  const { favoritos, addFavorito, removeFavorito, isFavorito } = useFavoritos();
  const router = useRouter();

  // Mostrar notificación temporal tipo pop-up
  const showNotificacion = (tipo: "success" | "error", mensaje: string) => {
    setNotificacion({ tipo, mensaje });
    setTimeout(() => setNotificacion(null), 2000);
  };

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

  // Acciones con notificación
  const handleAddToCart = (prod: any) => {
    addToCart({
      producto_id: prod.id,
      nombre: prod.nombre,
      imagen: prod.imagen,
      talla: prod.tallas?.[0] || "",
      color: prod.colores?.[0] || "",
      precio: prod.precio,
      cantidad: 1,
      stock: prod.stock,
    });
    showNotificacion("success", "Producto agregado al carrito");
  };

  const handleToggleFavorite = (prod: any, e: React.MouseEvent) => {
    e?.stopPropagation?.();
    if (isFavorito(prod.id)) {
      removeFavorito(prod.id);
      showNotificacion("success", "Producto eliminado de favoritos");
    } else {
      addFavorito(prod.id);
      showNotificacion("success", "Producto agregado a favoritos");
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col">
      <Header />
      {/* Notificación tipo pop-up */}
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
      <main className="max-w-7xl mx-auto px-2 py-8 w-full flex flex-col flex-1">
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
              {/* Barra visual de rango */}
              <div
                className="absolute top-1/2 left-0 h-2 bg-black rounded"
                style={{
                  width: `${
                    ((precioMax - precioMin) / (PRECIO_MAX - PRECIO_MIN)) * 100
                  }%`,
                  left: `${
                    ((precioMin - PRECIO_MIN) / (PRECIO_MAX - PRECIO_MIN)) * 100
                  }%`,
                  right: `${
                    100 -
                    ((precioMax - PRECIO_MIN) / (PRECIO_MAX - PRECIO_MIN)) * 100
                  }%`,
                  transform: "translateY(-50%)",
                  zIndex: 0,
                }}
              />
            </div>
          </div>
        </div>
        {/* Productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {productosPagina.map((p, idx) => (
            <div
              key={`${p.id}-${idx}`}
              className="cursor-pointer"
              onClick={() => router.push(`/catalogo/${p.id}`)}
            >
              <ProductCard
                {...p}
                favorito={isFavorito(p.id)}
                onToggleFavorite={(e: React.MouseEvent) =>
                  handleToggleFavorite(p, e)
                }
                onAddToCart={() => handleAddToCart(p)}
              />
            </div>
          ))}
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
