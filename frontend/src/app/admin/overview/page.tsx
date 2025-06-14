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
    <main className="flex-1 p-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg">Órdenes</h2>
          <div className="flex gap-2">
            {["dia", "semana", "mes"].map((f) => (
              <button
                key={f}
                className={`px-3 py-1 rounded ${
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
          height={300}
        />
      </div>
      {/* Ordenes recientes */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg">Órdenes Recientes</h2>
          <a href="/admin/orders" className="text-primary hover:underline">
            Ver Todas
          </a>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 border-b">
              <th className="py-2">Id</th>
              <th>Nombre Cliente</th>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Costo</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {ordenesRecientes.map((o: any) => (
              <tr key={o.id} className="border-b">
                <td className="py-2">{o.codigo || o.id}</td>
                <td className="text-primary font-semibold">
                  {o.usuario_nombre}
                </td>
                <td>{o.producto_nombre}</td>
                <td>{o.categoria_nombre}</td>
                <td>${o.costo?.toLocaleString("es-CO")}</td>
                <td>
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
    </main>
  );
}

// Componente para los stats
function StatBox({ title, value, icon, color, negativo }: any) {
  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <img src={icon} alt={title} className="h-7 w-7" />
        <span className="text-xs text-gray-500">{title}</span>
      </div>
      <div className="text-2xl font-bold text-gray-800">
        ${value?.toLocaleString("es-CO")}
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`text-xs font-bold ${
            negativo ? "text-red-500" : "text-green-500"
          }`}
        >
          {negativo ? "-1.23%" : "+1.23%"}
        </span>
        <span className="text-xs text-gray-400">vs anterior</span>
      </div>
    </div>
  );
}
