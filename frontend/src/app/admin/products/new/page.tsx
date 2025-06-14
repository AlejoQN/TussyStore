"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import ProductForm from "@/components/admin/ProductForm";
import { useRouter } from "next/navigation";

export default function CrearProducto() {
  const [categorias, setCategorias] = useState<
    { id: number; nombre: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    axios
      .get("/api/productos/categorias")
      .then((res) => setCategorias(res.data.categorias));
  }, []);

  const handleSubmit = async (form: any, file: File | null) => {
    setLoading(true);
    let imagen = "";
    if (file) {
      const data = new FormData();
      data.append("imagenes", file);
      const res = await axios.post("/api/productos/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      imagen = res.data.urls[0];
    }
    await axios.post("/api/productos", { ...form, imagen });
    setLoading(false);
    router.push("/admin/products");
  };

  return (
    <ProductForm
      categorias={categorias}
      onSubmit={handleSubmit}
      loading={loading}
      mode="create"
    />
  );
}
