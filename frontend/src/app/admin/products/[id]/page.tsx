"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";

type Producto = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  descuento?: number;
  imagen: string;
  tallas?: string;
  colores?: string;
  stock: number;
  destacado?: number;
};

export default function AdminProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    axios
      .get(`/api/productos/${id}`)
      .then((res) => setProducto(res.data))
      .catch(() => setProducto(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">Cargando producto...</div>
    );
  }

  if (!producto) {
    return (
      <div className="p-8 text-center text-red-500">
        Producto no encontrado.
        <div className="mt-4">
          <Link
            href="/admin/products"
            className="text-primary underline font-semibold"
          >
            Volver al listado
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="text-primary underline"
        >
          ← Volver
        </button>
        <h1 className="text-2xl font-bold flex-1">{producto.nombre}</h1>
        <Link
          href={`/admin/products`}
          className="text-sm text-gray-500 hover:underline"
        >
          Listado
        </Link>
        <Link
          href={`/admin/products/${producto.id}/edit`}
          className="bg-yellow-400 text-white px-4 py-2 rounded font-semibold ml-2"
        >
          Editar
        </Link>
      </div>
      <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row gap-8">
        <div className="flex-shrink-0">
          <img
            src={
              producto.imagen?.startsWith("http")
                ? producto.imagen
                : `/uploads/${producto.imagen?.replace(/^\/?uploads\//, "")}`
            }
            alt={producto.nombre}
            className="w-56 h-56 object-contain rounded border"
          />
        </div>
        <div className="flex-1 flex flex-col gap-3">
          <div>
            <span className="font-semibold">Descripción: </span>
            <span>{producto.descripcion}</span>
          </div>
          <div>
            <span className="font-semibold">Precio: </span>
            <span>${producto.precio.toLocaleString("es-CO")}</span>
            {producto.descuento && producto.descuento > 0 && (
              <>
                <span className="ml-2 text-gray-400 line-through">
                  $
                  {(
                    producto.precio /
                    (1 - (producto.descuento ?? 0) / 100)
                  ).toLocaleString("es-CO")}
                </span>
                <span className="ml-2 bg-pink-200 text-pink-700 text-xs rounded px-2 py-0.5 font-semibold">
                  -{producto.descuento}%
                </span>
              </>
            )}
          </div>
          <div>
            <span className="font-semibold">Stock: </span>
            <span>{producto.stock}</span>
          </div>
          <div>
            <span className="font-semibold">Tallas: </span>
            <span>
              {producto.tallas
                ? producto.tallas.split(",").join(", ")
                : "No especificadas"}
            </span>
          </div>
          <div>
            <span className="font-semibold">Colores: </span>
            <span>
              {producto.colores
                ? producto.colores.split(",").join(", ")
                : "No especificados"}
            </span>
          </div>
          <div>
            <span className="font-semibold">Destacado: </span>
            <span>{producto.destacado ? "Sí" : "No"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
