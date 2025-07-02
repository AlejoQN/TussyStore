"use client";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useEffect, useState } from "react";
import api from "@/utils/axios";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

type Direccion = {
  id: number;
  nombre: string;
  direccion: string;
  ciudad: string;
  departamento: string;
  telefono: string;
  principal: boolean;
};

export default function PerfilDirecciones() {
  const { token, user } = useAuth();
  const [direcciones, setDirecciones] = useState<Direccion[]>([]);
  const [form, setForm] = useState<Partial<Direccion>>({});
  const [editId, setEditId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!token) return;
    api
      .get("/direcciones", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setDirecciones(res.data.direcciones))
      .catch(() => setDirecciones([]));
  }, [token]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (editId) {
      await api.put(`/direcciones/${editId}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      await api.post("/direcciones", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    setShowForm(false);
    setEditId(null);
    setForm({});
    // Refrescar direcciones
    const res = await api.get("/direcciones", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setDirecciones(res.data.direcciones);
  };

  const handleEditar = (dir: Direccion) => {
    setForm(dir);
    setEditId(dir.id);
    setShowForm(true);
  };

  const handleEliminar = async (id: number) => {
    if (!token) return;
    await api.delete(`/direcciones/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setDirecciones((prev) => prev.filter((d) => d.id !== id));
  };

  const handlePrincipal = async (id: number) => {
    if (!token) return;
    await api.put(
      `/direcciones/${id}/principal`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    // Refrescar direcciones
    const res = await api.get("/direcciones", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setDirecciones(res.data.direcciones);
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Header />
      <main className="flex-1 max-w-6xl mx-auto w-full px-2 sm:px-4 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 mt-2 sm:mt-4 text-center sm:text-left">
          Mis Direcciones
        </h1>
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-10">
          {/* Sidebar */}
          <aside className="w-full max-w-full sm:max-w-xs lg:w-72 bg-white border rounded-xl shadow p-0 mb-6 lg:mb-0 self-start">
            <div className="flex flex-col items-center gap-2 py-6 border-b">
              <img
                src={user?.foto || "/img/perfil-demo.jpg"}
                alt="Foto de perfil"
                className="w-16 h-16 sm:w-14 sm:h-14 rounded-full object-cover border"
              />
              <div className="font-semibold text-xs sm:text-sm text-gray-700 mt-2">
                Hola <span className="text-lg">👋</span>
              </div>
              <div className="font-bold text-base sm:text-lg">
                {user?.nombre || "Usuario"}
              </div>
            </div>
            <nav className="flex flex-col gap-0 mt-2">
              <Link
                href="/perfil"
                className="flex items-center gap-2 px-4 sm:px-6 py-3 text-base text-left hover:bg-gray-100"
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
                className="flex items-center gap-2 px-4 sm:px-6 py-3 text-base text-left hover:bg-gray-100"
              >
                <span className="inline-block w-5">
                  {/* SVG caja */}
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
                className="flex items-center gap-2 px-4 sm:px-6 py-3 text-base text-left hover:bg-gray-100"
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
                className="flex items-center gap-2 px-4 sm:px-6 py-3 text-base text-left bg-black text-white font-semibold"
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
              className="text-xs text-red-500 hover:underline px-4 sm:px-6 py-3 text-left flex items-center"
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
          {/* Lista de direcciones */}
          <div className="flex-1">
            <div className="flex justify-end mb-4">
              <button
                className="bg-black text-white px-4 py-2 rounded font-semibold hover:bg-pink-500"
                onClick={() => {
                  setForm({});
                  setEditId(null);
                  setShowForm(true);
                }}
              >
                + Nueva dirección
              </button>
            </div>
            <div className="bg-white rounded-xl shadow p-4">
              {showForm && (
                <form className="mb-8" onSubmit={handleGuardar}>
                  <div className="flex flex-wrap gap-4">
                    <input
                      type="text"
                      name="nombre"
                      placeholder="Nombre de la dirección"
                      className="border rounded px-3 py-2 w-full md:w-1/2"
                      value={form.nombre || ""}
                      onChange={handleInput}
                      required
                    />
                    <input
                      type="text"
                      name="direccion"
                      placeholder="Dirección"
                      className="border rounded px-3 py-2 w-full md:w-1/2"
                      value={form.direccion || ""}
                      onChange={handleInput}
                      required
                    />
                    <input
                      type="text"
                      name="ciudad"
                      placeholder="Ciudad"
                      className="border rounded px-3 py-2 w-full md:w-1/2"
                      value={form.ciudad || ""}
                      onChange={handleInput}
                      required
                    />
                    <input
                      type="text"
                      name="departamento"
                      placeholder="Departamento"
                      className="border rounded px-3 py-2 w-full md:w-1/2"
                      value={form.departamento || ""}
                      onChange={handleInput}
                      required
                    />
                    <input
                      type="text"
                      name="telefono"
                      placeholder="Teléfono"
                      className="border rounded px-3 py-2 w-full md:w-1/2"
                      value={form.telefono || ""}
                      onChange={handleInput}
                      required
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 mt-4">
                    <button
                      type="submit"
                      className="bg-black text-white px-4 py-2 rounded font-semibold hover:bg-pink-500"
                    >
                      Guardar
                    </button>
                    <button
                      type="button"
                      className="border px-4 py-2 rounded font-semibold"
                      onClick={() => {
                        setShowForm(false);
                        setEditId(null);
                        setForm({});
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}
              {direcciones.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                  No tienes direcciones guardadas.
                </div>
              ) : (
                <ul>
                  {direcciones.map((dir) => (
                    <li
                      key={dir.id}
                      className="flex flex-col md:flex-row md:items-center gap-2 py-4 border-b last:border-b-0"
                    >
                      <div className="flex-1">
                        <div className="font-bold">{dir.nombre}</div>
                        <div className="text-sm text-gray-700">
                          {dir.direccion}, {dir.ciudad}, {dir.departamento}
                        </div>
                        <div className="text-xs text-gray-500">
                          Tel: {dir.telefono}
                        </div>
                        {dir.principal && (
                          <span className="inline-block bg-black text-white text-xs px-2 py-1 rounded mt-1">
                            Principal
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        {!dir.principal && (
                          <button
                            className="border px-3 py-1 rounded font-semibold hover:bg-gray-100 text-xs"
                            onClick={() => handlePrincipal(dir.id)}
                          >
                            Hacer principal
                          </button>
                        )}
                        <button
                          className="border px-3 py-1 rounded font-semibold hover:bg-gray-100 text-xs"
                          onClick={() => handleEditar(dir)}
                        >
                          Editar
                        </button>
                        <button
                          className="text-red-500 hover:bg-red-100 rounded px-3 py-1 font-semibold text-xs"
                          onClick={() => handleEliminar(dir.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
