"use client";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import PerfilSidebar from "@/components/perfil/PerfilSidebar";
import { useRouter } from "next/navigation";
import { useUserCart } from "@/hooks/userCart";

type Producto = {
  producto_id?: number;
  id?: number;
  nombre: string;
  imagen?: string;
  precio: number;
  cantidad: number;
  talla?: string;
  color?: string;
  stock?: number;
};

type Orden = {
  id: number;
  producto?: Producto;
  productos?: Producto[];
  estado: string;
  total?: number;
};

export default function PerfilOrdenes() {
  const { token, user } = useAuth();
  const { addToCart } = useUserCart();
  const router = useRouter();

  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [vista, setVista] = useState("ordenes");
  const [notificacion, setNotificacion] = useState("");

  useEffect(() => {
    if (!token) return;
    axios
      .get("/api/ordenes", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOrdenes(res.data.ordenes || []))
      .catch(() => setOrdenes([]));
  }, [token]);

  const handleCancel = async (id: number) => {
    if (!token) return;
    await axios.put(
      `/api/ordenes/cancelar/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    // Refresca las órdenes
    const res = await axios.get("/api/ordenes", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setOrdenes(res.data.ordenes || []);
  };

  // Función para volver a comprar
  const handleVolverAComprar = async (orden: Orden) => {
    const productos =
      orden.productos && Array.isArray(orden.productos)
        ? orden.productos
        : orden.producto
        ? [orden.producto]
        : [];
    for (const prod of productos) {
      if (!prod) continue;
      for (let i = 0; i < (prod.cantidad || 1); i++) {
        await addToCart({
          producto_id: prod.producto_id ?? prod.id ?? 0,
          nombre: prod.nombre,
          imagen: prod.imagen || "",
          precio: prod.precio,
          cantidad: 1,
          talla: prod.talla || "",
          color: prod.color || "",
          stock: prod.stock || 99,
        });
      }
    }
    setNotificacion("Productos añadidos al carrito");
    setTimeout(() => {
      setNotificacion("");
      router.push("/cart");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Header />
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
                className="flex items-center gap-2 px-6 py-3 text-base text-left bg-black text-white font-semibold"
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
                className="flex items-center gap-2 px-6 py-3 text-base text-left hover:bg-gray-100"
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
          {/* Contenido principal */}
          <div className="flex-1">
            <div className="flex flex-col gap-4">
              <div className="flex justify-end mb-4">
                <input
                  type="text"
                  placeholder="Buscar"
                  className="border rounded px-3 py-2 w-64"
                  // Implementa el estado y lógica de búsqueda si lo necesitas
                  readOnly
                />
              </div>
              {ordenes.length === 0 && (
                <div className="text-gray-500 text-center py-8">
                  No tienes órdenes registradas.
                </div>
              )}
              {ordenes.map((orden, idx) =>
                orden.producto ? (
                  <div
                    key={orden.id || idx}
                    className="flex flex-col md:flex-row items-center gap-4 border-b pb-4"
                  >
                    {/* Imagen */}
                    <img
                      src={
                        orden.producto.imagen?.startsWith("http")
                          ? orden.producto.imagen
                          : orden.producto.imagen
                          ? `/uploads/${orden.producto.imagen.replace(
                              /^\/?uploads\//,
                              ""
                            )}`
                          : "/img/no-image.png"
                      }
                      alt={`Orden #${orden.id}`}
                      className="w-16 h-16 object-contain rounded"
                    />
                    {/* Info */}
                    <div className="flex-1 flex flex-col gap-1">
                      <div className="font-semibold">Orden #{orden.id}</div>
                      <div className="text-xs text-gray-500">
                        Cantidad: {orden.producto.cantidad}
                      </div>
                      <div className="mt-1">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs border ${
                            orden.estado === "Enviado"
                              ? "bg-green-100 text-green-700 border-green-400"
                              : orden.estado === "En Proceso"
                              ? "bg-yellow-100 text-yellow-700 border-yellow-400"
                              : orden.estado === "Cancelado"
                              ? "bg-red-100 text-red-700 border-red-400"
                              : "bg-pink-100 text-pink-700 border-pink-400"
                          }`}
                        >
                          {orden.estado}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {orden.estado === "Enviado" &&
                          "Tu producto ha sido enviado"}
                        {orden.estado === "En Proceso" &&
                          "Tu producto está en proceso"}
                        {orden.estado === "Cancelado" &&
                          "Tu producto está en proceso"}
                        {orden.estado === "Devuelto" &&
                          "Tu producto ha sido devuelto"}
                      </div>
                    </div>
                    {/* Precio total y acciones */}
                    <div className="flex flex-col items-end gap-2 min-w-[120px]">
                      <div className="font-bold text-right">
                        {orden.total
                          ? `$${orden.total.toLocaleString("es-CO")}`
                          : orden.productos
                          ? `$${orden.productos
                              .reduce(
                                (sum, p) => sum + p.precio * (p.cantidad || 1),
                                0
                              )
                              .toLocaleString("es-CO")}`
                          : `$${orden.producto?.precio?.toLocaleString(
                              "es-CO"
                            )}`}
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="border px-3 py-1 rounded text-sm hover:bg-gray-100"
                          onClick={() =>
                            router.push(`/perfil/ordenes/${orden.id}`)
                          }
                          type="button"
                        >
                          Ver Orden
                        </button>
                        {orden.estado === "En Proceso" && (
                          <button
                            className="bg-red-200 text-red-700 px-3 py-1 rounded text-sm font-semibold hover:bg-red-300"
                            onClick={() => handleCancel(orden.id)}
                            type="button"
                          >
                            Cancelar Orden
                          </button>
                        )}
                        <button
                          className="bg-primary text-white px-3 py-1 rounded text-sm font-semibold hover:bg-pink-600"
                          onClick={() => handleVolverAComprar(orden)}
                          type="button"
                        >
                          Volver a comprar
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      {notificacion && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-2 rounded shadow z-50">
          {notificacion}
        </div>
      )}
    </div>
  );
}
