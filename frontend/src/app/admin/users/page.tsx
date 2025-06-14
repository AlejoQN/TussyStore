"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

type Usuario = {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  rol: string;
  direccion: string;
  foto?: string;
};

export default function UsersPage() {
  const { token } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [seleccionados, setSeleccionados] = useState<number[]>([]);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!token) return;
    axios
      .get("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsuarios(res.data));
  }, [token]);

  const handleSelect = (id: number) => {
    setSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (seleccionados.length === usuariosFiltrados.length) {
      setSeleccionados([]);
    } else {
      setSeleccionados(usuariosFiltrados.map((u) => u.id));
    }
  };

  const handleEliminarUsuarios = async () => {
    if (seleccionados.length === 0) return;
    await axios.post(
      "/api/admin/users/delete",
      { ids: seleccionados },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setUsuarios((prev) => prev.filter((u) => !seleccionados.includes(u.id)));
    setSeleccionados([]);
    setShowPopup(false);
  };

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.email.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.telefono.includes(busqueda)
  );

  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow border p-4">
        <div className="flex justify-between items-center mb-2">
          <input
            type="text"
            placeholder="🔍 Buscar"
            className="border rounded px-3 py-1 text-sm w-1/3"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button
            className="border px-3 py-1 rounded text-sm"
            onClick={() => setShowPopup(true)}
            disabled={seleccionados.length === 0}
          >
            Eliminar Usuarios
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">
                  <input
                    type="checkbox"
                    checked={
                      seleccionados.length === usuariosFiltrados.length &&
                      usuariosFiltrados.length > 0
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="p-2 text-left">Nombre</th>
                <th className="p-2 text-left">Correo Electronico</th>
                <th className="p-2 text-left">Número de teléfono</th>
                <th className="p-2 text-left">Rol</th>
                <th className="p-2 text-left">Dirección</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="p-2 text-center">
                    <input
                      type="checkbox"
                      checked={seleccionados.includes(u.id)}
                      onChange={() => handleSelect(u.id)}
                    />
                  </td>
                  <td className="p-2 flex items-center gap-2">
                    <img
                      src={
                        u.foto
                          ? u.foto.startsWith("http")
                            ? u.foto
                            : `/uploads/${u.foto.replace(/^\/?uploads\//, "")}`
                          : "/img/perfil-demo.jpg"
                      }
                      alt={u.nombre}
                      className="w-7 h-7 rounded-full object-cover border"
                    />
                    <span>{u.nombre}</span>
                  </td>
                  <td className="p-2">
                    <a
                      href={`mailto:${u.email}`}
                      className="text-blue-600 underline"
                    >
                      {u.email}
                    </a>
                  </td>
                  <td className="p-2">{u.telefono}</td>
                  <td className="p-2">{u.rol}</td>
                  <td className="p-2">{u.direccion}</td>
                </tr>
              ))}
              {usuariosFiltrados.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-gray-400 py-8">
                    No hay usuarios para mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pop-up de confirmación */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 shadow-lg text-center max-w-xs w-full">
            <div className="flex flex-col items-center mb-4">
              <div className="bg-gray-100 rounded-full p-4 mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4a2 2 0 012 2v2H7V5a2 2 0 012-2h4z"
                  />
                </svg>
              </div>
              <div className="font-bold text-lg mb-2">Borrar usuario</div>
              <div className="text-gray-600 text-sm mb-4">
                ¿Deseas borrar los usuarios? Esta acción será irreversible.
              </div>
            </div>
            <div className="flex justify-center gap-4">
              <button
                className="border px-4 py-2 rounded"
                onClick={() => setShowPopup(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={handleEliminarUsuarios}
              >
                Borrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
