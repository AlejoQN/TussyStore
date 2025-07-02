"use client";

import { useEffect, useState } from "react";
import api from "@/utils/axios";
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

const ESTADO_COLOR: Record<string, string> = {
  Pendiente: "bg-yellow-500 text-white",
  Cancelado: "bg-red-500 text-white",
  Completado: "bg-green-500 text-white",
};

const ESTADOS = ["Pendiente", "Completado", "Cancelado"];

export default function AdminOrdersPage() {
  const { token } = useAuth();
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<string>("");
  const [actualizando, setActualizando] = useState<number | null>(null);

  // Stats
  const [stats, setStats] = useState({
    completadas: 0,
    pendientes: 0,
    canceladas: 0,
    total: 0,
  });

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    api
      .get("/ordenes/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setOrdenes(res.data.ordenes);
        // Calcular stats
        const completadas = res.data.ordenes.filter(
          (o: Orden) => o.estado === "Completado" || o.estado === "Completada"
        ).length;
        const pendientes = res.data.ordenes.filter(
          (o: Orden) => o.estado === "Pendiente"
        ).length;
        const canceladas = res.data.ordenes.filter(
          (o: Orden) => o.estado === "Cancelado" || o.estado === "Cancelada"
        ).length;
        setStats({
          completadas,
          pendientes,
          canceladas,
          total: res.data.ordenes.length,
        });
      })
      .catch(() => setOrdenes([]))
      .finally(() => setLoading(false));
  }, [token]);

  // Cambiar estado de la orden
  const handleEstadoChange = async (id: number, nuevoEstado: string) => {
    if (!token) return;
    setActualizando(id);
    try {
      await api.put(
        `/ordenes/estado/${id}`,
        { nuevo_estado: nuevoEstado },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await api.get("/ordenes/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrdenes((prev) =>
        prev.map((o) => (o.id === id ? { ...o, estado: nuevoEstado } : o))
      );
      // Opcional: recargar stats
      const completadas = ordenes.filter(
        (o) =>
          (o.id === id ? nuevoEstado : o.estado) === "Completado" ||
          (o.id === id ? nuevoEstado : o.estado) === "Completada"
      ).length;
      const pendientes = ordenes.filter(
        (o) => (o.id === id ? nuevoEstado : o.estado) === "Pendiente"
      ).length;
      const canceladas = ordenes.filter(
        (o) =>
          (o.id === id ? nuevoEstado : o.estado) === "Cancelado" ||
          (o.id === id ? nuevoEstado : o.estado) === "Cancelada"
      ).length;
      setStats({
        completadas,
        pendientes,
        canceladas,
        total: ordenes.length,
      });
    } catch (err) {
      alert("Error actualizando estado");
    }
    setActualizando(null);
  };

  // Filtro de estado
  const ordenesFiltradas = filtro
    ? ordenes.filter((o) => o.estado.toLowerCase() === filtro.toLowerCase())
    : ordenes;

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F7FB] text-black">
      <main className="flex-1 max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-8 w-full">
        <h1 className="text-xl font-bold mb-6 text-[#3B82F6]">PEDIDOS</h1>
        <div className="bg-white rounded-xl shadow border p-2 sm:p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center mb-2 gap-2">
            <select
              className="border rounded px-3 py-1 w-full sm:w-auto"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            >
              <option value="">FILTRO</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Completado">Completado</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm min-w-[800px]">
              <thead>
                <tr className="text-[#3B82F6] font-semibold text-base border-b">
                  <th className="py-2 text-left">Id</th>
                  <th className="py-2 text-left">Nombre</th>
                  <th className="py-2 text-left">Producto</th>
                  <th className="py-2 text-left">Categoría</th>
                  <th className="py-2 text-left">IVA</th>
                  <th className="py-2 text-left">Costo</th>
                  <th className="py-2 text-left">Cantidad</th>
                  <th className="py-2 text-left">Fecha</th>
                  <th className="py-2 text-left">Estado</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} className="text-center py-8 text-gray-500">
                      Cargando...
                    </td>
                  </tr>
                ) : ordenesFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-8 text-gray-500">
                      No hay órdenes para mostrar.
                    </td>
                  </tr>
                ) : (
                  ordenesFiltradas.map((o, idx) => (
                    <tr
                      key={`${o.id}-${idx}`}
                      className="border-b hover:bg-gray-50 align-middle"
                    >
                      <td className="py-2">{o.id}</td>
                      <td>
                        <span className="text-[#3B82F6] font-semibold cursor-pointer hover:underline break-all">
                          {o.usuario_nombre}
                        </span>
                      </td>
                      <td className="break-all">{o.producto_nombre}</td>
                      <td className="break-all">{o.categoria_nombre}</td>
                      <td>%19</td>
                      <td>${o.costo?.toLocaleString("es-CO")}</td>
                      <td>{o.cantidad}</td>
                      <td>{o.fecha?.slice(0, 10) || "-"}</td>
                      <td>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              ESTADO_COLOR[o.estado] || "bg-gray-300 text-black"
                            }`}
                          >
                            {o.estado}
                          </span>
                          <select
                            className="border rounded px-2 py-1 text-xs"
                            value={o.estado}
                            disabled={actualizando === o.id}
                            onChange={(e) =>
                              handleEstadoChange(o.id, e.target.value)
                            }
                          >
                            {ESTADOS.map((estado) => (
                              <option key={estado} value={estado}>
                                {estado}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <StatBox
            title="ÓRDENES COMPLETADAS"
            value={stats.completadas}
            color="green"
          />
          <StatBox
            title="ÓRDENES PENDIENTES"
            value={stats.pendientes}
            color="orange"
          />
          <StatBox
            title="ÓRDENES CANCELADAS"
            value={stats.canceladas}
            color="red"
          />
          <StatBox title="ÓRDENES TOTALES" value={stats.total} color="green" />
        </div>
      </main>
    </div>
  );
}

function StatBox({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    green: "bg-green-100 text-green-700",
    orange: "bg-yellow-100 text-yellow-700",
    red: "bg-red-100 text-red-700",
  };
  return (
    <div
      className={`bg-white rounded-xl shadow p-4 sm:p-6 flex flex-col gap-2 items-center w-full`}
    >
      <div className="text-xs text-gray-500 font-semibold mb-1 text-center">
        {title}
      </div>
      <div className="text-2xl sm:text-3xl font-bold text-gray-800">
        {value}
      </div>
    </div>
  );
}
