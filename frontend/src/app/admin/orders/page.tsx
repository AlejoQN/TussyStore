"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

interface Orden {
  id: number;
  estado: string;
  fecha: string;
  usuario: number;
  usuario_nombre: string;
  cantidad: number;
  producto_nombre: string;
  categoria_nombre: string;
  costo: number;
}

export default function AdminOrdersPage() {
  const { token } = useAuth();
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    axios
      .get("/api/ordenes/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOrdenes(res.data.ordenes))
      .catch(() => setOrdenes([]))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        <h1 className="text-2xl font-bold mb-8">Órdenes</h1>
        <div className="bg-white rounded-xl shadow border p-4">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Cargando...</div>
          ) : ordenes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay órdenes para mostrar.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 border-b">
                  <th className="py-2">ID</th>
                  <th>Usuario</th>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Cantidad</th>
                  <th>Costo</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {ordenes.map((o) => (
                  <tr key={o.id} className="border-b">
                    <td>{o.id}</td>
                    <td>{o.usuario_nombre}</td>
                    <td>{o.producto_nombre || "-"}</td>
                    <td>{o.categoria_nombre || "-"}</td>
                    <td>{o.cantidad || "-"}</td>
                    <td>
                      {o.costo !== null && o.costo !== undefined
                        ? `$${o.costo.toLocaleString("es-CO")}`
                        : "-"}
                    </td>
                    <td>{o.estado}</td>
                    <td>{o.fecha?.slice(0, 10)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
