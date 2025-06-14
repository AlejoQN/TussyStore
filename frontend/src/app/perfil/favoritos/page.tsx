"use client";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useUserCart } from "@/hooks/userCart";
import { useFavoritos } from "@/hooks/useFavoritos";

type Favorito = {
  id: number;
  nombre: string;
  imagen: string;
  precio: number;
  talla?: string;
  color?: string;
};

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  descuento?: number;
  imagen: string;
  imagenes?: string[];
  tallas?: string[];
  colores?: string[];
  stock: number;
  categoria: number;
}

export default function PerfilFavoritos() {
  const { token, user } = useAuth();
  const [favoritos, setFavoritos] = useState<Favorito[]>([]);
  const [busqueda, setBusqueda] = useState("");
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
  const [vista, setVista] = useState<"favoritos" | "producto">("favoritos");

  // Mostrar notificación temporal
  const showNotificacion = (tipo: "success" | "error", mensaje: string) => {
    setNotificacion({ tipo, mensaje });
    setTimeout(() => setNotificacion(null), 2000);
  };

  useEffect(() => {
    if (!token) return;
    axios
      .get("/api/favoritos", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setFavoritos(res.data.favoritos))
      .catch(() => setFavoritos([]));
  }, [token]);

  const handleEliminar = async (id: number) => {
    if (!token) return;
    await axios.delete(`/api/favoritos/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setFavoritos((prev) => prev.filter((f) => f.id !== id));
  };

  const handleAgregarAlCarrito = async (producto: Favorito) => {
    if (!token) return;
    await axios.post(
      "/api/cart",
      {
        productoId: producto.id,
        talla: producto.talla,
        color: producto.color,
        cantidad: 1,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    // Opcional: feedback visual
  };

  // ARREGLA EL ERROR DE RELACIONADOS: asegúrate de que la ruta exista en el backend (ver más abajo)
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

  useEffect(() => {
    if (!id) return;
    axios.get(`/api/productos/${id}`).then((res) => {
      const p = res.data;
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

  // Cambia el corazón a rojo si es favorito
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

  const favoritosFiltrados = favoritos.filter((f) =>
    f.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
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
      <main className="flex-1 max-w-6xl mx-auto w-full px-2 sm:px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 mt-4">Mi perfil</h1>
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar */}
          <aside className="w-full max-w-xs lg:w-72 bg-white border rounded-xl shadow p-0 mb-8 lg:mb-0 self-start">
            <div className="flex flex-col items-center gap-2 py-6 border-b">
              <img
                src={user?.foto || "/img/perfil-demo.jpg"}
                alt="Foto de perfil"
                className="w-14 h-14 rounded-full object-cover border"
              />
              <div className="font-semibold text-sm text-gray-700 mt-2">
                Hola <span className="text-lg">👋</span>
              </div>
              <div className="font-bold">{user?.nombre || "Usuario"}</div>
            </div>
            <nav className="flex flex-col gap-0 mt-2">
              <Link
                href="/perfil"
                className="flex items-center gap-2 px-6 py-3 text-base text-left hover:bg-gray-100"
              >
                <span className="inline-block w-5">
                  {/* SVG usuario */}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5"
                    stroke="currentColor"
                  >
                    <circle cx="12" cy="8" r="4" strokeWidth="2" />
                    <path
                      d="M4 20c0-3.314 3.134-6 7-6s7 2.686 7 6"
                      strokeWidth="2"
                    />
                  </svg>
                </span>
                Información personal
              </Link>
              <Link
                href="/perfil/ordenes"
                className="flex items-center gap-2 px-6 py-3 text-base text-left hover:bg-gray-100"
              >
                <span className="inline-block w-5">
                  {/* SVG caja */}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5"
                    stroke="currentColor"
                  >
                    <rect
                      x="3"
                      y="7"
                      width="18"
                      height="13"
                      rx="2"
                      strokeWidth="2"
                    />
                    <path d="M16 3v4M8 3v4M3 11h18" strokeWidth="2" />
                  </svg>
                </span>
                Mis ordenes
              </Link>
              <Link
                href="/perfil/favoritos"
                className="flex items-center gap-2 px-6 py-3 text-base text-left bg-black text-white font-semibold"
              >
                <span className="inline-block w-5">
                  {/* SVG corazón */}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5"
                    stroke="currentColor"
                  >
                    <path
                      d="M12 21C12 21 4 13.5 4 8.5C4 5.5 6.5 3 9.5 3C11.24 3 12.91 4.01 13.44 5.61C13.97 4.01 15.64 3 17.38 3C20.38 3 22.88 5.5 22.88 8.5C22.88 13.5 15 21 15 21H12Z"
                      strokeWidth="2"
                    />
                  </svg>
                </span>
                Favoritos
              </Link>
              <Link
                href="/perfil/direcciones"
                className="flex items-center gap-2 px-6 py-3 text-base text-left hover:bg-gray-100"
              >
                <span className="inline-block w-5">
                  {/* SVG ubicación */}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5"
                    stroke="currentColor"
                  >
                    <path
                      d="M12 21s-6-5.686-6-10A6 6 0 0 1 18 11c0 4.314-6 10-6 10Z"
                      strokeWidth="2"
                    />
                    <circle cx="12" cy="11" r="2" strokeWidth="2" />
                  </svg>
                </span>
                Mis Direcciones
              </Link>
            </nav>
            <button className="text-xs text-red-500 hover:underline px-6 py-3 text-left">
              {/* SVG eliminar */}
              <span className="inline-block w-4 mr-2 align-middle">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4"
                  stroke="currentColor"
                >
                  <path
                    d="M3 6h18M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14Z"
                    strokeWidth="2"
                  />
                </svg>
              </span>
              Eliminar Cuenta
            </button>
          </aside>
          {/* Lista de favoritos */}
          <div className="flex-1">
            <div className="flex justify-end mb-4">
              <input
                type="text"
                placeholder="Buscar"
                className="border rounded px-3 py-2 w-64"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <div className="bg-white rounded-xl shadow p-4">
              {favoritosFiltrados.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                  No tienes productos en favoritos.
                </div>
              ) : (
                <ul>
                  {favoritosFiltrados.map((fav, idx) => (
                    <li
                      key={`${fav.id}-${idx}`}
                      className="flex items-center gap-4 py-6 border-b last:border-b-0"
                    >
                      <img
                        src={
                          fav.imagen?.startsWith("http")
                            ? fav.imagen
                            : fav.imagen
                            ? `/uploads/${fav.imagen.replace(
                                /^\/?uploads\//,
                                ""
                              )}`
                            : "/img/no-image.png"
                        }
                        alt={fav.nombre}
                        className="h-20 w-20 object-contain rounded"
                      />
                      <div className="flex-1">
                        <div className="font-bold">{fav.nombre}</div>
                        <div className="text-xs text-gray-600 mb-1">
                          {fav.talla && <>Talla: {fav.talla} </>}
                          {fav.color && <>| Color: {fav.color}</>}
                        </div>
                        <div className="font-semibold text-lg">
                          ${fav.precio.toLocaleString("es-CO")}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 min-w-[120px]">
                        <button
                          className="border px-3 py-1 rounded font-semibold hover:bg-gray-100"
                          onClick={() => handleAgregarAlCarrito(fav)}
                        >
                          Agregar al carrito
                        </button>
                        <button
                          className="text-red-500 hover:bg-red-100 rounded px-3 py-1 font-semibold"
                          onClick={() => handleEliminar(fav.id)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 inline-block mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          Quitar
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
