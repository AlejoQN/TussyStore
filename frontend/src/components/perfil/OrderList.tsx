import React from "react";

export type Orden = {
  id: number;
  producto: {
    nombre: string;
    imagen: string;
    talla: string;
    cantidad: number;
    precio: number;
  };
  estado: "Enviado" | "En Proceso" | "Cancelado" | "Devuelto";
  mensaje: string;
};

const ESTADO_COLOR: Record<string, string> = {
  Enviado: "bg-green-100 text-green-700",
  "En Proceso": "bg-yellow-100 text-yellow-700",
  Cancelado: "bg-red-100 text-red-500",
  Devuelto: "bg-pink-100 text-pink-500",
};

export default function OrderList({ ordenes }: { ordenes: Orden[] }) {
  if (!ordenes.length)
    return (
      <div className="text-center text-gray-500 py-12">
        No tienes órdenes registradas.
      </div>
    );

  return (
    <ul>
      {ordenes.map((orden) => (
        <li
          key={orden.id}
          className="flex items-center gap-4 py-6 border-b last:border-b-0"
        >
          <img
            src={orden.producto.imagen}
            alt={orden.producto.nombre}
            className="h-20 w-20 object-contain rounded"
          />
          <div className="flex-1">
            <div className="font-bold">{orden.producto.nombre}</div>
            <div className="text-xs text-gray-600 mb-1">
              Talla: {orden.producto.talla} <span className="mx-1">|</span>{" "}
              Cantidad: {orden.producto.cantidad}
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs px-2 py-1 rounded ${
                  ESTADO_COLOR[orden.estado]
                }`}
              >
                {orden.estado}
              </span>
              <span className="text-xs text-gray-500">{orden.mensaje}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 min-w-[120px]">
            <div className="font-semibold text-lg">
              ${orden.producto.precio.toLocaleString("es-CO")}
            </div>
            <div className="flex gap-2">
              <button className="border px-3 py-1 rounded font-semibold hover:bg-gray-100">
                Ver Orden
              </button>
              {orden.estado === "En Proceso" ? (
                <button className="bg-red-200 text-red-700 px-3 py-1 rounded font-semibold hover:bg-red-300">
                  Cancelar Orden
                </button>
              ) : (
                <button className="bg-black text-white px-3 py-1 rounded font-semibold hover:bg-pink-500">
                  Volver A Comprar
                </button>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
