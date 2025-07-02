"use client";
import { useEffect, useRef, useState } from "react";
import api from "@/utils/axios";
import { useAuth } from "@/context/AuthContext";

export default function PerfilDatosPersonales() {
  const { token } = useAuth();
  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    telefono: "",
    direccion: "",
    foto: "",
  });
  const [editando, setEditando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar datos reales del usuario al montar
  useEffect(() => {
    async function fetchUser() {
      try {
        const { data } = await api.get("/api/usuario/perfil", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm({
          nombre: data.nombre || "",
          apellidos: data.apellidos || "",
          email: data.email || "",
          telefono: data.telefono || "",
          direccion: data.direccion || "",
          foto: data.foto
            ? data.foto.startsWith("http")
              ? data.foto
              : `/uploads/${data.foto.replace(/^\/?uploads\//, "")}`
            : "/img/perfil-demo.jpg",
        });
      } catch {
        setMensaje("Error cargando datos del usuario");
      }
    }
    if (token) fetchUser();
  }, [token]);

  // Cambios en los campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Cambiar foto de perfil
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("foto", file);
    try {
      const { data } = await api.post("/api/usuario/subir-foto", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setForm((prev) => ({
        ...prev,
        foto: `/uploads/${data.url.replace(/^\/?uploads\//, "")}`,
      }));
      setMensaje("Foto actualizada correctamente");
      setTimeout(() => setMensaje(""), 2000);
    } catch {
      setMensaje("Error al subir la foto");
    }
  };

  // Guardar cambios
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let foto = form.foto;
    try {
      // Si hay nueva imagen, súbela primero
      if (file) {
        const data = new FormData();
        data.append("foto", file);
        const res = await api.post("/usuario/upload-foto", data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        foto = res.data.url;
      }
      await api.put("/usuario/perfil", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMensaje("¡Datos guardados correctamente!");
      setEditando(false);
    } catch {
      setMensaje("Error al guardar los datos");
    } finally {
      setTimeout(() => setMensaje(""), 2000);
    }
  };

  return (
    <section>
      <h1 className="text-3xl font-bold mb-8 mt-4">Mi perfil</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar usuario */}
        <aside className="w-full max-w-xs lg:w-80 bg-white border rounded-xl shadow p-6 mb-8 lg:mb-0 self-start">
          <div className="flex flex-col items-center gap-2 mb-6">
            <img
              src={form.foto || "/img/perfil-demo.jpg"}
              alt="Foto de perfil"
              className="w-16 h-16 rounded-full object-cover border"
            />
            <div className="font-semibold text-sm text-gray-700 mt-2">
              Hola <span className="text-lg">👋</span>
            </div>
            <div className="font-bold text-lg">
              {form.nombre} {form.apellidos}
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
                src={form.foto || "/img/perfil-demo.jpg"}
                alt="Foto de perfil"
                className="w-28 h-28 rounded-full object-cover border shadow"
              />
              {editando && (
                <button
                  type="button"
                  className="absolute bottom-2 right-2 bg-black text-white rounded-full p-2 text-xs"
                  onClick={() => fileInputRef.current?.click()}
                  title="Cambiar foto"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-2.828 1.172H7v-2a4 4 0 011.172-2.828z"
                    />
                  </svg>
                </button>
              )}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
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
                name="nombre"
                value={form.nombre}
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
                Correo Electrónico
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
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
