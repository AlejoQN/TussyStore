"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Producto {
  id: number;
  nombre: string;
  imagen: string;
  referencia: string;
  stock: number;
  fecha: string;
  categoria: string | number;
  genero?: string;
}

export default function AdminProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<
    { id: number; nombre: string }[]
  >([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroGenero, setFiltroGenero] = useState("");
  const [filtroStock, setFiltroStock] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState<number | null>(
    null
  );
  const router = useRouter();

  useEffect(() => {
    axios.get("/api/productos").then((res) => {
      setProductos(res.data.items);
    });
    axios.get("/api/productos/categorias").then((res) => {
      setCategorias(res.data.categorias);
    });
  }, []);

  const generos = ["Hombre", "Mujer", "Unisex"];

  const productosFiltrados = productos.filter((p) => {
    const matchBusqueda = p.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    const matchCategoria = filtroCategoria
      ? String(p.categoria) === filtroCategoria
      : true;
    const matchGenero = filtroGenero ? p.genero === filtroGenero : true;
    const matchStock =
      filtroStock === "conStock"
        ? p.stock > 0
        : filtroStock === "sinStock"
        ? p.stock <= 0
        : true;
    return matchBusqueda && matchCategoria && matchGenero && matchStock;
  });

  const handleEliminar = (id: number) => {
    setProductoAEliminar(id);
    setShowPopup(true);
  };

  const handleConfirmarEliminar = async () => {
    if (productoAEliminar) {
      await axios.delete(`/api/productos/${productoAEliminar}`);
      setProductos((prev) => prev.filter((p) => p.id !== productoAEliminar));
      setShowPopup(false);
      setProductoAEliminar(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <main className="flex-1 max-w-6xl mx-auto px-2 sm:px-4 py-6 sm:py-8 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex flex-wrap gap-2">
            {/* Filtro Categoría */}
            <select
              className="border rounded px-2 py-1 text-sm"
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
            >
              <option value="">Categoría</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
            {/* Filtro Género */}
            <select
              className="border rounded px-2 py-1 text-sm"
              value={filtroGenero}
              onChange={(e) => setFiltroGenero(e.target.value)}
            >
              <option value="">Género</option>
              {generos.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
            {/* Filtro Stock */}
            <select
              className="border rounded px-2 py-1 text-sm"
              value={filtroStock}
              onChange={(e) => setFiltroStock(e.target.value)}
            >
              <option value="">Filtro de Stock</option>
              <option value="conStock">Con stock</option>
              <option value="sinStock">Sin stock</option>
            </select>
            <button
              className="border rounded px-4 py-1 text-sm"
              onClick={() => {
                setFiltroCategoria("");
                setFiltroGenero("");
                setFiltroStock("");
                setBusqueda("");
              }}
            >
              Limpiar
            </button>
          </div>
          <button
            className="border rounded px-4 py-2 text-sm font-semibold w-full sm:w-auto"
            onClick={() => router.push("/admin/products/new")}
          >
            + Añadir Producto
          </button>
        </div>
        <div className="bg-white rounded-xl shadow border p-2 sm:p-4">
          <div className="mb-4 flex flex-col sm:flex-row items-center gap-2">
            <input
              type="text"
              placeholder="Buscar"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="border rounded px-3 py-1 w-full sm:w-64"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm min-w-[600px]">
              <thead>
                <tr className="text-gray-500 border-b text-left">
                  <th className="py-2 px-2 w-8"></th> {/* Checkbox */}
                  <th className="px-2">Nombre</th>
                  <th className="px-2 text-center">Imagen</th>
                  <th className="px-2">Referencia</th>
                  <th className="px-2">Stock</th>
                  <th className="px-2">Fecha</th>
                  <th className="px-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productosFiltrados.map((p) => (
                  <tr key={p.id} className="border-b align-middle">
                    <td className="px-2 text-center">
                      <input type="checkbox" />
                    </td>
                    <td className="px-2">
                      <div className="font-semibold">{p.nombre}</div>
                    </td>
                    <td className="px-2 text-center">
                      <img
                        src={
                          p.imagen?.startsWith("http")
                            ? p.imagen
                            : p.imagen
                            ? `/uploads/${p.imagen.replace(
                                /^\/?uploads\//,
                                ""
                              )}`
                            : "/img/no-image.png"
                        }
                        alt={p.nombre}
                        className="w-10 h-10 object-contain rounded-full inline-block"
                      />
                    </td>
                    <td className="px-2">#{p.referencia || p.id}</td>
                    <td className="px-2">
                      {p.stock > 0 ? (
                        <span className="text-green-600 font-semibold">
                          En Stock
                        </span>
                      ) : (
                        <span className="text-red-500 font-semibold">
                          Fuera de Stock
                        </span>
                      )}
                    </td>
                    <td className="px-2">{p.fecha?.slice(0, 10)}</td>
                    <td className="px-2 text-center">
                      <div className="flex gap-2 items-center justify-center">
                        {/* Ver */}
                        <button
                          className="p-2 hover:bg-gray-100 rounded"
                          title="Ver"
                          onClick={() => router.push(`/admin/products/${p.id}`)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-700"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>
                        {/* Editar */}
                        <button
                          className="p-2 hover:bg-gray-100 rounded"
                          title="Editar"
                          onClick={() =>
                            router.push(`/admin/products/${p.id}/edit`)
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-blue-600"
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
                        {/* Eliminar */}
                        <button
                          className="p-2 hover:bg-gray-100 rounded"
                          title="Eliminar"
                          onClick={() => handleEliminar(p.id)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-red-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {productosFiltrados.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                      No hay productos para mostrar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Pop-up de confirmación de borrado */}
        {showPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 px-2">
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 max-w-xs w-full text-center relative">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-black text-xl"
                onClick={() => setShowPopup(false)}
              >
                ×
              </button>
              <div className="mb-4">
                <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
                  <svg
                    className="h-10 w-10 text-gray-700"
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
                <div className="font-bold text-lg mb-2">Borrar Producto</div>
                <div className="text-gray-600 text-sm mb-4">
                  ¿Quieres borrar este producto? Esta acción será irreversible
                </div>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button
                    className="border px-4 py-2 rounded"
                    onClick={() => setShowPopup(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded"
                    onClick={handleConfirmarEliminar}
                  >
                    Borrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
