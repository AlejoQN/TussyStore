"use client";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function PerfilPage() {
  const { token, setUser, loading } = useAuth();
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
  const [loadingState, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");

  const [passForm, setPassForm] = useState({
    actual: "",
    nueva: "",
    confirmar: "",
  });
  const [passMsg, setPassMsg] = useState("");

  const [editando, setEditando] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Cargar datos reales del usuario al montar
  useEffect(() => {
    if (loading) return; // Espera a que el contexto termine de cargar
    if (!token) {
      setMensaje("No autenticado");
      setLoading(false);
      return;
    }
    async function fetchUser() {
      try {
        const { data } = await axios.get("/api/usuario/perfil", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const foto =
          data.foto &&
          !data.foto.startsWith("http") &&
          !data.foto.startsWith("/uploads/")
            ? `/uploads/${data.foto.replace(/^\/?uploads\//, "")}`
            : data.foto || "";
        setForm({
          nombres: data.nombre || "",
          apellidos: data.apellidos || "",
          correo: data.email || "",
          telefono: data.telefono || "",
          direccion: data.direccion || "",
          foto,
        });
        setUser &&
          setUser((prev: any) => ({
            ...prev,
            nombre: data.nombre || "",
            email: data.email || "",
            telefono: data.telefono || "",
            direccion: data.direccion || "",
            foto,
          }));
        setMensaje("");
      } catch (err: any) {
        setMensaje(
          err.response?.data?.error || "Error cargando datos del usuario"
        );
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [token, loading, setUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Al guardar cambios
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(
        "/api/usuario/perfil",
        {
          nombre: form.nombres,
          telefono: form.telefono,
          direccion: form.direccion,
          foto: form.foto,
          email: form.correo,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
        setUser &&
          setUser((prev: any) => ({
            ...prev,
            nombre: form.nombres,
            apellidos: form.apellidos,
            telefono: form.telefono,
            direccion: form.direccion,
            foto: form.foto,
            email: form.correo,
          }));
      setTimeout(() => setMensaje(""), 2000);
    } catch {
      setMensaje("Error al guardar los datos");
    } finally {
      setLoading(false);
    }
  };

  const handlePassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassForm({ ...passForm, [e.target.name]: e.target.value });
  };

  const handlePassSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg("");
    if (passForm.nueva !== passForm.confirmar) {
      setPassMsg("Las contraseñas nuevas no coinciden.");
      return;
    }
    try {
      await axios.post(
        "/api/auth/cambiar-password",
        { actual: passForm.actual, nueva: passForm.nueva },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPassMsg("¡Contraseña actualizada correctamente!");
      setPassForm({ actual: "", nueva: "", confirmar: "" });
    } catch (err: any) {
      setPassMsg(err.response?.data?.error || "Error al cambiar la contraseña");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("foto", file);
    try {
      const { data } = await axios.post("/api/usuario/subir-foto", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      const fotoUrl = data.url
        ? `/uploads/${data.url.replace(/^\/?uploads\//, "")}`
        : data.foto
        ? `/uploads/${data.foto.replace(/^\/?uploads\//, "")}`
        : form.foto;
      setForm((prev) => ({
        ...prev,
        foto: fotoUrl,
      }));
      // Actualiza el contexto global
      setUser && setUser((prev: any) => ({ ...prev, foto: fotoUrl }));
      setMensaje("Foto actualizada correctamente");
      setTimeout(() => setMensaje(""), 2000);
    } catch {
      setMensaje("Error al subir la foto");
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
                    className="w-28 h-28 rounded-full object-cover border shadow"
                  />
                  {/* Botón para cambiar foto, visible solo en modo edición */}
                  {editando && (
                    <button
                      type="button"
                      className="absolute bottom-2 right-2 bg-black text-white rounded-full p-2 text-xs"
                      onClick={() => fileInputRef.current?.click()}
                      title="Cambiar foto"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
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
                    name="nombres"
                    value={form.nombres}
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
              <div className="flex justify-end gap-3">
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
        {vista === "datos" && (
          <form
            onSubmit={handlePassSubmit}
            className="max-w-md mx-auto mt-12 bg-white p-8 rounded-xl shadow-lg border flex flex-col gap-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center justify-center bg-primary/10 text-primary rounded-full w-10 h-10">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 15v2m0 4a2 2 0 002-2h-4a2 2 0 002 2zm6-6V9a6 6 0 10-12 0v6a2 2 0 002 2h8a2 2 0 002-2z"
                  />
                </svg>
              </span>
              <h2 className="font-bold text-xl text-black">
                Cambiar contraseña
              </h2>
            </div>
            <div className="text-gray-500 text-sm mb-2">
              Cambia tu contraseña para mantener tu cuenta segura.
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-black">
                Contraseña actual
              </label>
              <input
                type="password"
                name="actual"
                placeholder="Contraseña actual"
                className="w-full border rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-primary"
                value={passForm.actual}
                onChange={handlePassChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-black">
                Nueva contraseña
              </label>
              <input
                type="password"
                name="nueva"
                placeholder="Nueva contraseña"
                className="w-full border rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-primary"
                value={passForm.nueva}
                onChange={handlePassChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-black">
                Confirmar nueva contraseña
              </label>
              <input
                type="password"
                name="confirmar"
                placeholder="Confirmar nueva contraseña"
                className="w-full border rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-primary"
                value={passForm.confirmar}
                onChange={handlePassChange}
                required
              />
            </div>
            {passMsg && (
              <div
                className={`mb-2 text-sm text-center font-semibold ${
                  passMsg.includes("correcta")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {passMsg}
              </div>
            )}
            <button
              type="submit"
              className="bg-primary hover:bg-black transition-colors text-white px-8 py-2 rounded font-semibold mt-2"
            >
              Cambiar contraseña
            </button>
          </form>
        )}
      </main>
      <Footer />
    </div>
  );
}
