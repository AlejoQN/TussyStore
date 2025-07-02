"use client";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useEffect, useState } from "react";
import api from "@/utils/axios";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

export default function PerfilFavoritos() {
  const { token, user } = useAuth();
  const [favoritos, setFavoritos] = useState<Favorito[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const router = useRouter();
  const { addToCart } = useUserCart();

  const [notificacion, setNotificacion] = useState<{
    tipo: "success" | "error";
    mensaje: string;
  } | null>(null);

  // Estado para hover por tarjeta
  const [hovered, setHovered] = useState<number | null>(null);

  // Estado para popup de confirmación
  const [popup, setPopup] = useState<{ open: boolean; id: number | null }>({
    open: false,
    id: null,
  });

  // Mostrar notificación temporal
  const showNotificacion = (tipo: "success" | "error", mensaje: string) => {
    setNotificacion({ tipo, mensaje });
    setTimeout(() => setNotificacion(null), 2000);
  };

  // Obtener favoritos del usuario
  useEffect(() => {
    if (!token) return;
    api
      .get("/favoritos", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setFavoritos(res.data.favoritos))
      .catch(() => setFavoritos([]));
  }, [token]);

  // Eliminar favorito (con confirmación)
  const handleEliminar = async (id: number) => {
    if (!token) return;
    await api.delete(`/favoritos/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setFavoritos((prev) => prev.filter((f) => f.id !== id));
    showNotificacion("success", "Producto eliminado de favoritos");
    setPopup({ open: false, id: null });
  };

  // Agregar al carrito
  const handleAgregarAlCarrito = async (producto: Favorito) => {
    if (!token) return;
    await api.post(
      "/cart",
      {
        productoId: producto.id,
        talla: producto.talla,
        color: producto.color,
        cantidad: 1,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
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
      {/* Pop-up de confirmación */}
      {popup.open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 sm:p-8 shadow-lg text-center max-w-xs w-full">
            <div className="text-lg font-bold mb-4">Eliminar producto</div>
            <div className="mb-6 text-gray-700">
              ¿Estás seguro de eliminar este producto de tus favoritos?
            </div>
            <button
              className="w-full py-2 rounded bg-red-100 text-red-600 font-semibold hover:bg-red-200 mb-2"
              onClick={() => handleEliminar(popup.id!)}
            >
              Eliminar
            </button>
            <button
              className="w-full py-2 rounded bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200"
              onClick={() => setPopup({ open: false, id: null })}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
      <main className="flex-1 max-w-6xl mx-auto w-full px-2 sm:px-4 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 mt-2 sm:mt-4 text-center sm:text-left">
          Mis Favoritos
        </h1>
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-10">
          {/* Sidebar */}
          <aside className="w-full max-w-full sm:max-w-xs lg:w-72 bg-white border rounded-xl shadow p-0 mb-6 lg:mb-0 self-start">
            <div className="flex flex-col items-center gap-2 py-6 border-b">
              <img
                src={user?.foto || "/img/perfil-demo.jpg"}
                alt="Foto de perfil"
                className="w-16 h-16 sm:w-14 sm:h-14 rounded-full object-cover border"
              />
              <div className="font-semibold text-xs sm:text-sm text-gray-700 mt-2">
                Hola <span className="text-lg">👋</span>
              </div>
              <div className="font-bold text-base sm:text-lg">
                {user?.nombre || "Usuario"}
              </div>
            </div>
            <nav className="flex flex-col gap-0 mt-2">
              <Link
                href="/perfil"
                className="flex items-center gap-2 px-4 sm:px-6 py-3 text-base text-left hover:bg-gray-100"
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
                className="flex items-center gap-2 px-4 sm:px-6 py-3 text-base text-left hover:bg-gray-100"
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
                className="flex items-center gap-2 px-4 sm:px-6 py-3 text-base text-left bg-black text-white font-semibold"
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
                className="flex items-center gap-2 px-4 sm:px-6 py-3 text-base text-left hover:bg-gray-100"
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
            <button className="text-xs text-red-500 hover:underline px-4 sm:px-6 py-3 text-left flex items-center">
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
          {/* Lista de favoritos tipo tarjetas */}
          <div className="flex-1">
            <div className="flex justify-end mb-4">
              <input
                type="text"
                placeholder="Buscar"
                className="border rounded px-3 py-2 w-full sm:w-64"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            {favoritosFiltrados.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                No tienes productos en favoritos.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {favoritosFiltrados.map((fav, idx) => (
                  <div
                    key={`${fav.id}-${idx}`}
                    className="relative bg-white rounded-xl shadow flex flex-col items-center p-4 transition-all duration-200 hover:shadow-lg min-h-[320px]"
                    onMouseEnter={() => setHovered(fav.id)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {/* Botón eliminar en la esquina */}
                    {hovered === fav.id && (
                      <button
                        className="absolute top-3 right-3 text-red-500 hover:bg-red-100 rounded-full p-1 z-10"
                        onClick={() => setPopup({ open: true, id: fav.id })}
                        title="Quitar de favoritos"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
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
                      </button>
                    )}
                    {/* Imagen */}
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
                      className="w-32 h-32 sm:w-36 sm:h-36 object-contain mb-4"
                    />
                    {/* Botón agregar al carrito */}
                    {hovered === fav.id && (
                      <button
                        className="mb-3 bg-gray-100 hover:bg-black hover:text-white text-black px-4 py-2 rounded shadow font-medium transition"
                        onClick={() => handleAgregarAlCarrito(fav)}
                      >
                        Agregar al Carrito
                      </button>
                    )}
                    {/* Nombre y descripción */}
                    <div className="w-full mt-auto">
                      <div className="font-bold text-base mt-2">
                        {fav.nombre}
                      </div>
                      <div className="text-sm text-gray-600">
                        {fav.talla && <>Talla: {fav.talla} </>}
                        {fav.color && <>| Color: {fav.color}</>}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-semibold text-base">
                          ${fav.precio.toLocaleString("es-CO")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
