import React from "react";

type Props = {
  vista: string;
  setVista: (v: any) => void;
};

export default function PerfilSidebar({ vista, setVista }: Props) {
  return (
    <aside className="w-full md:w-64 bg-gray-50 border-r border-gray-200 p-4 flex md:flex-col gap-2 md:gap-4">
      <button
        className={`text-left w-full py-2 px-3 rounded ${vista === "datos" ? "bg-primary text-white" : "hover:bg-gray-100"}`}
        onClick={() => setVista("datos")}
      >
        Datos personales
      </button>
      <button
        className={`text-left w-full py-2 px-3 rounded ${vista === "direcciones" ? "bg-primary text-white" : "hover:bg-gray-100"}`}
        onClick={() => setVista("direcciones")}
      >
        Mis direcciones
      </button>
      <button
        className={`text-left w-full py-2 px-3 rounded ${vista === "favoritos" ? "bg-primary text-white" : "hover:bg-gray-100"}`}
        onClick={() => setVista("favoritos")}
      >
        Favoritos
      </button>
      <button
        className={`text-left w-full py-2 px-3 rounded ${vista === "ordenes" ? "bg-primary text-white" : "hover:bg-gray-100"}`}
        onClick={() => setVista("ordenes")}
      >
        Mis órdenes
      </button>
      <button
        className={`text-left w-full py-2 px-3 rounded ${vista === "eliminar" ? "bg-red-500 text-white" : "hover:bg-red-100 text-red-500"}`}
        onClick={() => setVista("eliminar")}
      >
        Eliminar cuenta
      </button>
    </aside>
  );
}