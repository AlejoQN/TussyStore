"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

export default function DetalleOrden() {
  const { id } = useParams();
  const { token } = useAuth();
  const router = useRouter();
  const [orden, setOrden] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !id) return;
    axios
      .get(`/api/ordenes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOrden(res.data.orden))
      .finally(() => setLoading(false));
  }, [id, token]);

  if (loading) {
    return (
      <div>
        <Header />
        <main className="p-8 text-center text-black">Cargando...</main>
        <Footer />
      </div>
    );
  }

  if (!orden) {
    return (
      <div>
        <Header />
        <main className="p-8 text-center text-red-500">
          Orden no encontrada
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto w-full px-2 sm:px-4 py-8">
        <button
          className="mb-4 text-sm text-primary hover:underline"
          onClick={() => router.back()}
        >
          ← Volver a mis órdenes
        </button>
        <h1 className="text-2xl font-bold mb-6 text-black">
          Detalle de la Orden #{orden.id}
        </h1>
        <div className="mb-4">
          <span className="font-semibold text-black">Estado:</span>{" "}
          <span className="px-2 py-1 rounded text-xs bg-gray-100 border text-black">
            {orden.estado}
          </span>
        </div>
        <div className="mb-4">
          <span className="font-semibold text-black">Fecha:</span>{" "}
          <span className="text-black">
            {orden.fecha && new Date(orden.fecha).toLocaleString("es-CO")}
          </span>
        </div>
        <div className="mb-6">
          <span className="font-semibold text-black">Dirección de envío:</span>
          <div className="text-sm text-black">
            {orden.direccion?.nombre && <div>{orden.direccion.nombre}</div>}
            {orden.direccion?.direccion && (
              <div>{orden.direccion.direccion}</div>
            )}
            {orden.direccion?.ciudad && <div>{orden.direccion.ciudad}</div>}
            {orden.direccion?.telefono && (
              <div>Tel: {orden.direccion.telefono}</div>
            )}
          </div>
        </div>
        <div className="mb-6">
          <span className="font-semibold text-black">Productos:</span>
          <ul className="divide-y divide-gray-100 mt-2">
            {orden.productos?.map((prod: any, idx: number) => (
              <li key={idx} className="flex items-center gap-4 py-4">
                <img
                  src={
                    prod.imagen?.startsWith("http")
                      ? prod.imagen
                      : prod.imagen
                      ? `/uploads/${prod.imagen.replace(/^\/?uploads\//, "")}`
                      : "/img/no-image.png"
                  }
                  alt={prod.nombre}
                  className="h-16 w-16 object-contain rounded"
                />
                <div className="flex-1">
                  <div className="font-bold text-black">{prod.nombre}</div>
                  <div className="text-xs text-black">
                    {prod.talla && <>Talla: {prod.talla} </>}
                    {prod.color && <>| Color: {prod.color}</>}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-black">
                    ${prod.precio.toLocaleString("es-CO")}
                  </div>
                  <div className="text-xs text-black">x{prod.cantidad}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="font-bold text-lg text-right text-black">
          Total: ${orden.total?.toLocaleString("es-CO")}
        </div>
      </main>
      <Footer />
    </div>
  );
}
