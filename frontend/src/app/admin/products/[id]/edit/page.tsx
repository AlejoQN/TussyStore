"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import ProductForm from "@/components/admin/ProductForm";
import { useRouter, useParams } from "next/navigation";

export default function EditarProducto() {
  const { id } = useParams();
  const [categorias, setCategorias] = useState<
    { id: number; nombre: string }[]
  >([]);
  const [producto, setProducto] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    axios
      .get("/api/productos/categorias")
      .then((res) => setCategorias(res.data.categorias));
    axios.get(`/api/productos/${id}`).then((res) => setProducto(res.data));
  }, [id]);

  const handleSubmit = async (form: any, file: File | null) => {
    setLoading(true);
    let imagen = producto.imagen; // Usa la imagen actual por defecto
    if (file) {
      const data = new FormData();
      data.append("imagenes", file);
      const res = await axios.post("/api/productos/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      imagen = res.data.urls[0];
    }
    await axios.put(`/api/productos/${id}`, { ...form, imagen });
    setLoading(false);
    router.push("/admin/products");
  };

  if (!producto) return <div className="p-8">Cargando...</div>;

  return (
    <ProductForm
      initialValues={producto}
      categorias={categorias}
      onSubmit={handleSubmit}
      loading={loading}
      mode="edit"
    />
  );
}
