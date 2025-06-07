"use client";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

export default function PerfilPage() {
  const [vista, setVista] = useState<
    "datos" | "ordenes" | "favoritos" | "direcciones" | "eliminar"
  >("datos");
  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    telefono: "",
    correo: "",
    direccion: "",
    foto: "",
  });
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar datos reales del usuario al montar
  useEffect(() => {
    async function fetchUser() {
      try {
        const { data } = await axios.get("/api/usuario/perfil");
        setForm({
          nombres: data.nombres || "",
          apellidos: data.apellidos || "",
          telefono: data.telefono || "",
          correo: data.correo || "",
          direccion: data.direccion || "",
          foto: data.foto || "/img/perfil-demo.jpg",
        });
      } catch {
        setMensaje("Error cargando datos del usuario");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put("/api/usuario/perfil", form);
      setMensaje("Datos guardados correctamente");
      setTimeout(() => setMensaje(""), 2000);
    } catch {
      setMensaje("Error al guardar los datos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Header />
      <main className="flex-1 max-w-6xl mx-auto w-full px-2 sm:px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 mt-4">Mi perfil</h1>
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar */}
          <aside className="w-full max-w-xs lg:w-72 bg-white border rounded-xl shadow p-0 mb-8 lg:mb-0 self-start">
            <div className="flex flex-col items-center gap-2 py-6 border-b">
              <img
                src={form.foto || "/img/perfil-demo.jpg"}
                alt="Foto de perfil"
                className="w-14 h-14 rounded-full object-cover border"
              />
              <div className="font-semibold text-sm text-gray-700 mt-2">
                Hola <span className="text-lg">👋</span>
              </div>
              <div className="font-bold">
                {form.nombres} {form.apellidos}
              </div>
            </div>
            <nav className="flex flex-col gap-0 mt-2">
              <Link
                href="/perfil"
                className={`flex items-center gap-2 px-6 py-3 text-base text-left ${
                  vista === "datos"
                    ? "bg-black text-white font-semibold"
                    : "hover:bg-gray-100"
                }`}
              >
                <span className="inline-block w-5">
                  {/* SVG usuario */}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5"
                    stroke="currentColor"
                  >
                    <circle cx="12" cy="8" r="4" strokeWidth="2" />
                    <path
                      d="M4 20c0-3.314 3.134-6 7-6s7 2.686 7 6"
                      strokeWidth="2"
                    />
                  </svg>
                </span>
                Información personal
              </Link>
              <Link
                href="/perfil/ordenes"
                className={`flex items-center gap-2 px-6 py-3 text-base text-left ${
                  vista === "ordenes"
                    ? "bg-black text-white font-semibold"
                    : "hover:bg-gray-100"
                }`}
              >
                <span className="inline-block w-5">
                  {/* SVG órdenes */}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5"
                    stroke="currentColor"
                  >
                    <rect
                      x="3"
                      y="7"
                      width="18"
                      height="13"
                      rx="2"
                      strokeWidth="2"
                    />
                    <path d="M16 3v4M8 3v4M3 11h18" strokeWidth="2" />
                  </svg>
                </span>
                Mis ordenes
              </Link>
              <Link
                href="/perfil/favoritos"
                className={`flex items-center gap-2 px-6 py-3 text-base text-left ${
                  vista === "favoritos"
                    ? "bg-black text-white font-semibold"
                    : "hover:bg-gray-100"
                }`}
              >
                <span className="inline-block w-5">
                  {/* SVG corazón */}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5"
                    stroke="currentColor"
                  >
                    <path
                      d="M12 21C12 21 4 13.5 4 8.5C4 5.5 6.5 3 9.5 3C11.24 3 12.91 4.01 13.44 5.61C13.97 4.01 15.64 3 17.38 3C20.38 3 22.88 5.5 22.88 8.5C22.88 13.5 15 21 15 21H12Z"
                      strokeWidth="2"
                    />
                  </svg>
                </span>
                Favoritos
              </Link>
              <Link
                href="/perfil/direcciones"
                className={`flex items-center gap-2 px-6 py-3 text-base text-left ${
                  vista === "direcciones"
                    ? "bg-black text-white font-semibold"
                    : "hover:bg-gray-100"
                }`}
              >
                <span className="inline-block w-5">
                  {/* SVG ubicación */}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5"
                    stroke="currentColor"
                  >
                    <path
                      d="M12 21s-6-5.686-6-10A6 6 0 0 1 18 11c0 4.314-6 10-6 10Z"
                      strokeWidth="2"
                    />
                    <circle cx="12" cy="11" r="2" strokeWidth="2" />
                  </svg>
                </span>
                Mis Direcciones
              </Link>
            </nav>
            <Link
              href="/perfil/eliminar"
              className="text-xs text-red-500 hover:underline px-6 py-3 text-left flex items-center"
            >
              <span className="inline-block w-4 mr-2 align-middle">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4"
                  stroke="currentColor"
                >
                  <path
                    d="M3 6h18M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14Z"
                    strokeWidth="2"
                  />
                </svg>
              </span>
              Eliminar Cuenta
            </Link>
          </aside>
          {/* Formulario principal */}
          {vista === "datos" && (
            <form className="flex-1" onSubmit={handleSubmit}>
              <div className="flex flex-col items-center mb-8">
                <div className="relative group">
                  <img
                    src={form.foto || "/img/perfil-demo.jpg"}
                    alt="Foto de perfil"
                    className="w-24 h-24 rounded-full object-cover border"
                  />
                  <button
                    type="button"
                    className="absolute bottom-2 right-2 bg-gray-200 rounded-full p-2 border hover:bg-pink-400 transition"
                    onClick={handleFotoClick}
                    title="Cambiar foto"
                  >
                    {/* SVG editar */}
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="w-5 h-5"
                      stroke="currentColor"
                    >
                      <path d="M12 20h9" strokeWidth="2" />
                      <path
                        d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5Z"
                        strokeWidth="2"
                      />
                    </svg>
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
                  />
                </div>
              </div>
              <div className="mb-6">
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
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-primary text-white px-8 py-2 rounded font-semibold"
                  disabled={loading}
                >
                  Guardar cambios
                </button>
              </div>
              {mensaje && (
                <div className="mt-4 text-green-600 font-semibold">
                  {mensaje}
                </div>
              )}
            </form>
          )}
          {vista === "ordenes" && (
            <div className="flex-1"> {/* Aquí irá la vista de órdenes */} </div>
          )}
          {vista === "favoritos" && (
            <div className="flex-1">{/* Aquí irá la vista de favoritos */}</div>
          )}
          {vista === "direcciones" && (
            <div className="flex-1">
              {/* Aquí irá la vista de direcciones */}
            </div>
          )}
          {vista === "eliminar" && (
            <div className="flex-1">
              {/* Aquí irá la vista de eliminar cuenta */}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
