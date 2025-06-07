"use client";
import { useState, useRef } from "react";

export default function PerfilDatosPersonales() {
  // Simulación de datos del usuario (reemplazar por datos reales del backend)
  const [form, setForm] = useState({
    nombres: "Marco",
    apellidos: "Polo",
    telefono: "300 35689524",
    correo: "Marcopolo123@gmail.com",
    direccion: "Cl. 85D Sur #54C-43, Medellín, Antioquia",
    foto: "/img/perfil-demo.jpg", // Cambia por la ruta real o avatar por defecto
  });
  const [editando, setEditando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cambiar foto de perfil
  const handleFotoClick = () => {
    fileInputRef.current?.click();
  };
  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setForm((prev) => ({ ...prev, foto: url }));
      // Aquí deberías subir la imagen al backend y guardar la URL real
    }
  };

  // Cambios en los campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Guardar cambios
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí deberías llamar a la API para guardar los cambios
    setMensaje("¡Datos guardados correctamente!");
    setTimeout(() => setMensaje(""), 2000);
    setEditando(false);
  };

  return (
    <section>
      <h1 className="text-3xl font-bold mb-8 mt-4">Mi perfil</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar usuario */}
        <aside className="w-full max-w-xs lg:w-80 bg-white border rounded-xl shadow p-6 mb-8 lg:mb-0 self-start">
          <div className="flex flex-col items-center gap-2 mb-6">
            <img
              src={form.foto}
              alt="Foto de perfil"
              className="w-16 h-16 rounded-full object-cover border"
            />
            <div className="font-semibold text-sm text-gray-700 mt-2">
              Hola{" "}
              <span className="text-lg" role="img" aria-label="wave">
                👋
              </span>
            </div>
            <div className="font-bold text-lg">
              {form.nombres} {form.apellidos}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <button className="flex items-center gap-2 px-4 py-2 rounded bg-black text-white font-semibold">
              <img src="/img/iconos/user.svg" alt="" className="h-5 w-5" />
              Información personal
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100">
              <img src="/img/iconos/orden.svg" alt="" className="h-5 w-5" />
              Mis ordenes
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100">
              <img src="/img/iconos/favorito.svg" alt="" className="h-5 w-5" />
              Favoritos
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100">
              <img src="/img/iconos/direccion.svg" alt="" className="h-5 w-5" />
              Mis Direcciones
            </button>
            <button className="mt-2 text-xs text-red-500 hover:underline self-center">
              Eliminar Cuenta
            </button>
          </div>
        </aside>
        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 bg-white rounded-xl shadow p-8 border"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <img
                src={form.foto}
                alt="Foto de perfil"
                className="w-28 h-28 rounded-full object-cover border shadow"
              />
              <button
                type="button"
                className="absolute bottom-2 right-2 bg-gray-200 rounded-full p-2 border hover:bg-pink-400 transition"
                onClick={handleFotoClick}
                title="Cambiar foto"
              >
                <img
                  src="/img/iconos/editar.svg"
                  alt="Editar"
                  className="w-5 h-5"
                />
              </button>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFotoChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold mb-1">
                Nombres
              </label>
              <input
                type="text"
                name="nombres"
                value={form.nombres}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
                disabled={!editando}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Apellidos
              </label>
              <input
                type="text"
                name="apellidos"
                value={form.apellidos}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
                disabled={!editando}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
                disabled={!editando}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Correo Electronico
              </label>
              <input
                type="email"
                name="correo"
                value={form.correo}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
                disabled={!editando}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-1">
                Dirección
              </label>
              <input
                type="text"
                name="direccion"
                value={form.direccion}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
                disabled={!editando}
              />
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            {!editando ? (
              <button
                type="button"
                className="bg-primary text-white px-8 py-2 rounded font-semibold"
                onClick={() => setEditando(true)}
              >
                Editar
              </button>
            ) : (
              <button
                type="submit"
                className="bg-primary text-white px-8 py-2 rounded font-semibold"
              >
                Guardar cambios
              </button>
            )}
          </div>
          {mensaje && (
            <div className="mt-4 text-green-600 font-semibold">{mensaje}</div>
          )}
        </form>
      </div>
    </section>
  );
}
