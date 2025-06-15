import React, { useState, useRef } from "react";

interface ProductFormProps {
  initialValues?: any;
  categorias: { id: number; nombre: string }[];
  onSubmit: (values: any, file: File | null) => void;
  loading?: boolean;
  mode?: "create" | "edit";
}

export default function ProductForm({
  initialValues = {},
  categorias = [],
  onSubmit,
  loading,
  mode = "create",
}: ProductFormProps) {
  const [form, setForm] = useState({
    nombre: initialValues.nombre || "",
    descripcion: initialValues.descripcion || "",
    categoria: initialValues.categoria || "",
    estado: initialValues.estado || "draft",
    precio: initialValues.precio || "",
    descuento: initialValues.descuento || "",
    referencia: initialValues.referencia || "",
    codigo_barras: initialValues.codigo_barras || "",
    cantidad: initialValues.cantidad || "",
    stock: initialValues.stock || "",
    variaciones: initialValues.variaciones || [{ tipo: "", valor: "" }],
  });
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAddVariation = () => {
    setForm((prev) => ({
      ...prev,
      variaciones: [...prev.variaciones, { tipo: "", valor: "" }],
    }));
  };

  const handleVariationChange = (idx: number, field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      variaciones: prev.variaciones.map((v: any, i: number) =>
        i === idx ? { ...v, [field]: value } : v
      ),
    }));
  };

  const handleRemoveVariation = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      variaciones: prev.variaciones.filter((_: any, i: number) => i !== idx),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form, file);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto py-6 px-2 sm:px-4"
    >
      <h1 className="text-xl sm:text-2xl font-bold mb-4">
        {mode === "edit" ? "Editar Producto" : "Agregar Producto"}
      </h1>
      {/* Breadcrumb */}
      <div className="text-xs text-gray-500 mb-6">
        Dashboard &gt; Productos &gt; {mode === "edit" ? "Editar" : "Agregar"}{" "}
        Producto
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Columna principal */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Información General */}
          <section className="bg-white rounded-xl border p-4">
            <div className="font-semibold mb-2">Información General</div>
            <input
              name="nombre"
              placeholder="Nombre del Producto"
              value={form.nombre}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mb-3 text-base sm:text-lg"
              required
            />
            <textarea
              name="descripcion"
              placeholder="Descripción"
              value={form.descripcion}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-base sm:text-lg"
              rows={3}
              required
            />
          </section>
          {/* Media */}
          <section className="bg-white rounded-xl border p-4">
            <div className="font-semibold mb-2">Media</div>
            <div className="mb-2">Foto</div>
            <div
              className="border-2 border-dashed rounded-xl flex flex-col items-center justify-center py-8 mb-2 cursor-pointer bg-gray-50"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
            >
              {file ? (
                <div className="text-center">
                  <span className="block mb-2">{file.name}</span>
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="h-24 mx-auto object-contain"
                  />
                </div>
              ) : initialValues?.imagen ? (
                <img
                  src={
                    initialValues.imagen.startsWith("http")
                      ? initialValues.imagen
                      : `/uploads/${initialValues.imagen.replace(
                          /^\/?uploads\//,
                          ""
                        )}`
                  }
                  alt="Imagen actual"
                  className="h-24 mx-auto object-contain"
                />
              ) : (
                <span className="text-gray-400 text-center text-sm">
                  Arrastra la imagen aquí o dale clic a subir imagen
                </span>
              )}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            <button
              type="button"
              className="border rounded px-4 py-1 text-sm"
              onClick={() => fileInputRef.current?.click()}
            >
              Subir imagen
            </button>
          </section>
          {/* Precios */}
          <section className="bg-white rounded-xl border p-4">
            <div className="font-semibold mb-2">Precios</div>
            <input
              name="precio"
              type="number"
              placeholder="Precio Base"
              value={form.precio}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mb-3 text-base sm:text-lg"
              required
            />
            <input
              name="descuento"
              type="number"
              placeholder="Porcentaje del descuento (%)"
              value={form.descuento}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-base sm:text-lg"
            />
          </section>
          {/* Inventario */}
          <section className="bg-white rounded-xl border p-4">
            <div className="font-semibold mb-2">Inventario</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <input
                name="referencia"
                placeholder="Referencia"
                value={form.referencia}
                onChange={handleChange}
                className="border rounded px-3 py-2 text-base sm:text-lg"
              />
              <input
                name="codigo_barras"
                placeholder="Código de Barras"
                value={form.codigo_barras}
                onChange={handleChange}
                className="border rounded px-3 py-2 text-base sm:text-lg"
              />
              <input
                name="stock"
                type="number"
                placeholder="Cantidad"
                value={form.stock}
                onChange={handleChange}
                className="border rounded px-3 py-2 text-base sm:text-lg"
              />
            </div>
          </section>
          {/* Variaciones */}
          <section className="bg-white rounded-xl border p-4">
            <div className="font-semibold mb-2">Variaciones</div>
            {form.variaciones.map((v: any, idx: number) => (
              <div key={idx} className="flex flex-col sm:flex-row gap-2 mb-2">
                <select
                  value={v.tipo}
                  onChange={(e) =>
                    handleVariationChange(idx, "tipo", e.target.value)
                  }
                  className="border rounded px-3 py-2 text-base sm:text-lg"
                >
                  <option value="">Tipo de Variación</option>
                  <option value="talla">Talla</option>
                  <option value="color">Color</option>
                </select>
                <input
                  value={v.valor}
                  onChange={(e) =>
                    handleVariationChange(idx, "valor", e.target.value)
                  }
                  placeholder="Variación"
                  className="border rounded px-3 py-2 text-base sm:text-lg"
                />
                <button
                  type="button"
                  className="text-red-500 px-2"
                  onClick={() => handleRemoveVariation(idx)}
                >
                  &#10005;
                </button>
              </div>
            ))}
            <button
              type="button"
              className="border rounded px-4 py-1 text-sm mt-2"
              onClick={handleAddVariation}
            >
              + Agregar Variaciones
            </button>
          </section>
        </div>
        {/* Columna lateral */}
        <div className="flex flex-col gap-6">
          <section className="bg-white rounded-xl border p-4">
            <div className="font-semibold mb-2">Categoría</div>
            <select
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mb-3 text-base sm:text-lg"
              required
            >
              <option value="">Seleccionar...</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </section>
          <section className="bg-white rounded-xl border p-4">
            <div className="font-semibold mb-2">Estado</div>
            <select
              name="estado"
              value={form.estado}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-base sm:text-lg"
            >
              <option value="draft">Draft</option>
              <option value="publicado">Publicado</option>
              <option value="agotado">Agotado</option>
            </select>
          </section>
        </div>
      </div>
      {/* Botones */}
      <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
        <button
          type="button"
          className="border px-6 py-2 rounded mb-2 sm:mb-0"
          onClick={() => window.history.back()}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="bg-black text-white px-6 py-2 rounded font-semibold"
          disabled={loading}
        >
          {mode === "edit" ? "Guardar Cambios" : "+ Agregar Producto"}
        </button>
      </div>
    </form>
  );
}
