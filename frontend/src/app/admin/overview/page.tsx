"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import { useAuth } from "@/context/AuthContext"; // importa tu hook/contexto de auth

// Carga dinámica de la gráfica para evitar problemas de SSR
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function AdminOverview() {
  const { token } = useAuth();
  const [stats, setStats] = useState({
    ganancias: 0,
    ordenes: 0,
    clientes: 0,
    balance: 0,
    // ventas: [], // ya no se usa
  });
  const [ordenesData, setOrdenesData] = useState([]);
  const [ordenesLabels, setOrdenesLabels] = useState([]);
  const [ordenesFiltro, setOrdenesFiltro] = useState<"dia" | "semana" | "mes">(
    "dia"
  );
  const [ordenesRecientes, setOrdenesRecientes] = useState([]);

  useEffect(() => {
    if (!token) return;
    axios
      .get(`/api/analytics/ordenes?periodo=${ordenesFiltro}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setOrdenesData(res.data.map((v: any) => v.total));
        setOrdenesLabels(res.data.map((v: any) => v.periodo));
      });
    axios
      .get("/api/admin/overview", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setStats(res.data.stats);
        setOrdenesRecientes(res.data.ordenesRecientes);
      });
  }, [ordenesFiltro, token]);

  const chartOptions = {
    chart: { id: "ordenes" },
    xaxis: { categories: ordenesLabels },
    tooltip: {
      y: { formatter: (val: number) => `${val} órdenes` },
    },
  };

  return (
    <main className="flex-1 p-2 sm:p-4 md:p-8 bg-white">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8 w-full">
        <StatBox
          title="GANANCIAS TOTALES"
          value={stats.ganancias}
          icon="/img/iconos/ganancias.svg"
          color="blue"
        />
        <StatBox
          title="ÓRDENES TOTALES"
          value={stats.ordenes}
          icon="/img/iconos/ordenes.svg"
          color="green"
        />
        <StatBox
          title="CLIENTES TOTALES"
          value={stats.clientes}
          icon="/img/iconos/usuarios.svg"
          color="blue"
        />
        <StatBox
          title="BALANCE"
          value={stats.balance}
          icon="/img/iconos/balance.svg"
          color="red"
          negativo
        />
      </div>
      {/* Gráfica de órdenes */}
      <div className="bg-white rounded-xl shadow p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
          <h2 className="font-bold text-base sm:text-lg">Órdenes</h2>
          <div className="flex gap-2">
            {["dia", "semana", "mes"].map((f) => (
              <button
                key={f}
                className={`px-3 py-1 rounded text-xs sm:text-base ${
                  ordenesFiltro === f ? "bg-primary text-white" : "bg-gray-100"
                }`}
                onClick={() => setOrdenesFiltro(f as any)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <Chart
          options={chartOptions}
          series={[{ name: "Órdenes", data: ordenesData }]}
          type="line"
          height={250}
        />
      </div>
      {/* Ordenes recientes */}
      <div className="bg-white rounded-xl shadow p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
          <h2 className="font-bold text-base sm:text-lg">Órdenes Recientes</h2>
          <a
            href="/admin/orders"
            className="text-primary hover:underline text-sm sm:text-base"
          >
            Ver Todas
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm min-w-[600px]">
            <thead>
              <tr className="text-gray-500 border-b font-semibold text-left">
                <th className="py-2 px-2">Id</th>
                <th className="px-2">Nombre Cliente</th>
                <th className="px-2">Producto</th>
                <th className="px-2">Categoría</th>
                <th className="px-2">Costo</th>
                <th className="px-2">Estado</th>
              </tr>
            </thead>
            <tbody>
              {ordenesRecientes.map((o, idx) => (
                <tr key={`${o.id}-${idx}`} className="border-b align-middle">
                  <td className="py-2 px-2">{o.codigo || o.id}</td>
                  <td className="px-2">{o.usuario_nombre}</td>
                  <td className="px-2">{o.producto_nombre}</td>
                  <td className="px-2">{o.categoria_nombre}</td>
                  <td className="px-2">
                    {typeof o.costo === "number"
                      ? `$${o.costo.toLocaleString("es-CO")}`
                      : ""}
                  </td>
                  <td className="px-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        o.estado === "Pendiente"
                          ? "bg-yellow-400 text-white"
                          : o.estado === "Completado"
                          ? "bg-green-500 text-white"
                          : o.estado === "Cancelado"
                          ? "bg-red-500 text-white"
                          : "bg-gray-300"
                      }`}
                    >
                      {o.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

// Componente para los stats
function StatBox({ title, value, icon, color, negativo }: any) {
  return (
    <div className="bg-white rounded-xl shadow p-4 sm:p-6 flex flex-col gap-2 w-full">
      <div className="flex items-center gap-2">
        <img src={icon} alt={title} className="h-7 w-7" />
        <span className="text-xs text-gray-500">{title}</span>
      </div>
      <div className="text-xl sm:text-2xl font-bold text-gray-800">
        ${value?.toLocaleString("es-CO")}
      </div>
    </div>
  );
}
