import React from "react";

type Props = {
  vista: string;
  setVista: (v: string) => void;
  user: any;
  onEliminarCuenta: () => void;
};

export default function PerfilSidebar({
  vista,
  setVista,
  user,
  onEliminarCuenta,
}: Props) {
  return (
    <aside className="w-full md:w-64 bg-gray-50 border-r border-gray-200 p-4 flex md:flex-col gap-2 md:gap-4">
      <img
        src={
          user?.foto
            ? user.foto.startsWith("http")
              ? user.foto
              : `/uploads/${user.foto.replace(/^\/?uploads\//, "")}`
            : "/img/perfil-demo.jpg"
        }
        alt="Foto de perfil"
        className="w-16 h-16 sm:w-14 sm:h-14 rounded-full object-cover border"
      />
      <div className="font-bold text-base sm:text-lg">
        {user?.nombre || "Usuario"}
      </div>
      <button
        className={`text-left w-full py-2 px-3 rounded ${
          vista === "datos" ? "bg-primary text-white" : "hover:bg-gray-100"
        }`}
        onClick={() => setVista("datos")}
      >
        Información personal
      </button>
      <button
        className={`text-left w-full py-2 px-3 rounded ${
          vista === "ordenes" ? "bg-primary text-white" : "hover:bg-gray-100"
        }`}
        onClick={() => setVista("ordenes")}
      >
        Mis ordenes
      </button>
      <button
        className={`text-left w-full py-2 px-3 rounded ${
          vista === "favoritos" ? "bg-primary text-white" : "hover:bg-gray-100"
        }`}
        onClick={() => setVista("favoritos")}
      >
        Favoritos
      </button>
      <button
        className={`text-left w-full py-2 px-3 rounded ${
          vista === "direcciones"
            ? "bg-primary text-white"
            : "hover:bg-gray-100"
        }`}
        onClick={() => setVista("direcciones")}
      >
        Mis Direcciones
      </button>
      {/* Botón eliminar cuenta, diseño igual que los demás */}
      <button
        className="text-left w-full py-2 px-3 rounded hover:bg-red-100 text-red-500 mt-2"
        onClick={onEliminarCuenta}
        type="button"
      >
        Eliminar Cuenta
      </button>
    </aside>
  );
}
