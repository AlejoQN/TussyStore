"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const filtros = [
  { label: "Día", value: "dia" },
  { label: "Semana", value: "semana" },
  { label: "Mes", value: "mes" },
];

function CustomTooltip({ active, payload, label, tipo }: any) {
  if (active && payload && payload.length) {
    let texto = "";
    if (tipo === "ventas") texto = `Productos vendidos: ${payload[0].value}`;
    if (tipo === "ordenes") texto = `Órdenes: ${payload[0].value}`;
    if (tipo === "usuarios") texto = `Usuarios: ${payload[0].value}`;
    return (
      <div className="bg-white border rounded shadow-lg px-4 py-2 text-sm font-medium">
        <div>{texto}</div>
        <div className="text-gray-700">Fecha: {label}</div>
      </div>
    );
  }
  return null;
}

export default function AnalyticsPage() {
  const [ventas, setVentas] = useState([]);
  const [ordenes, setOrdenes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [filtroVentas, setFiltroVentas] = useState("dia");
  const [filtroOrdenes, setFiltroOrdenes] = useState("dia");
  const [filtroUsuarios, setFiltroUsuarios] = useState("dia");

  useEffect(() => {
    axios
      .get(`/api/analytics/ventas?periodo=${filtroVentas}`)
      .then((res) => setVentas(res.data));
  }, [filtroVentas]);
  useEffect(() => {
    axios
      .get(`/api/analytics/ordenes?periodo=${filtroOrdenes}`)
      .then((res) => setOrdenes(res.data));
  }, [filtroOrdenes]);
  useEffect(() => {
    axios
      .get(`/api/analytics/usuarios?periodo=${filtroUsuarios}`)
      .then((res) => setUsuarios(res.data));
  }, [filtroUsuarios]);

  // Calcula el máximo para cada dataset
  const maxVentas = Math.max(10, ...ventas.map((v: any) => v.total));
  const maxOrdenes = Math.max(10, ...ordenes.map((v: any) => v.total));
  const maxUsuarios = Math.max(10, ...usuarios.map((v: any) => v.total));

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F7FB] text-black">
      <main className="flex-1 max-w-5xl mx-auto px-2 sm:px-4 py-6 sm:py-8 w-full">
        {/* Ventas */}
        <section className="bg-white rounded-xl shadow p-3 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
            <h2 className="font-semibold text-base sm:text-lg text-[#3B82F6]">
              Ventas
            </h2>
            <div className="flex gap-2">
              {filtros.map((f) => (
                <button
                  key={f.value}
                  className={`text-xs px-3 py-1 rounded-full transition ${
                    filtroVentas === f.value
                      ? "bg-[#3B82F6] text-white"
                      : "bg-gray-100 text-[#3B82F6] hover:bg-[#3B82F6]/10"
                  }`}
                  onClick={() => setFiltroVentas(f.value)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <div className="w-full h-[120px] sm:h-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ventas}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="periodo" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, maxVentas]} tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip tipo="ventas" />} />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#3B82F6"
                  strokeWidth={2.5}
                  dot={{
                    r: 5,
                    fill: "#3B82F6",
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 7,
                    fill: "#3B82F6",
                    stroke: "#fff",
                    strokeWidth: 3,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
        {/* Órdenes */}
        <section className="bg-white rounded-xl shadow p-3 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
            <h2 className="font-semibold text-base sm:text-lg text-[#EF4444]">
              Órdenes
            </h2>
            <div className="flex gap-2">
              {filtros.map((f) => (
                <button
                  key={f.value}
                  className={`text-xs px-3 py-1 rounded-full transition ${
                    filtroOrdenes === f.value
                      ? "bg-[#EF4444] text-white"
                      : "bg-gray-100 text-[#EF4444] hover:bg-[#EF4444]/10"
                  }`}
                  onClick={() => setFiltroOrdenes(f.value)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <div className="w-full h-[120px] sm:h-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ordenes}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="periodo" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, maxOrdenes]} tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip tipo="ordenes" />} />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#EF4444"
                  strokeWidth={2.5}
                  dot={{
                    r: 5,
                    fill: "#EF4444",
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 7,
                    fill: "#EF4444",
                    stroke: "#fff",
                    strokeWidth: 3,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
        {/* Usuarios */}
        <section className="bg-white rounded-xl shadow p-3 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
            <h2 className="font-semibold text-base sm:text-lg text-[#8B5CF6]">
              Usuarios
            </h2>
            <div className="flex gap-2">
              {filtros.map((f) => (
                <button
                  key={f.value}
                  className={`text-xs px-3 py-1 rounded-full transition ${
                    filtroUsuarios === f.value
                      ? "bg-[#8B5CF6] text-white"
                      : "bg-gray-100 text-[#8B5CF6] hover:bg-[#8B5CF6]/10"
                  }`}
                  onClick={() => setFiltroUsuarios(f.value)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <div className="w-full h-[120px] sm:h-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={usuarios}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="periodo" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, maxUsuarios]} tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip tipo="usuarios" />} />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#8B5CF6"
                  strokeWidth={2.5}
                  dot={{
                    r: 5,
                    fill: "#8B5CF6",
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 7,
                    fill: "#8B5CF6",
                    stroke: "#fff",
                    strokeWidth: 3,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </main>
    </div>
  );
}
