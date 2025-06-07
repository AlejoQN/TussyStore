"use client";

import React, { useState, useEffect, useRef } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ProductCard from "@/components/products/productCard";
import { useUserCart } from "@/hooks/userCart";
import { useRouter } from "next/navigation";

// Define la interfaz del producto
interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  descuento: number;
  imagen: string;
  tallas: string[];
  colores: string[];
  stock: number;
  categoria: string;
}

export const mockProductos = [
  {
    id: 1,
    nombre: "Gorra Gucci",
    descripcion: "Gorra con diseño exclusivo y materiales premium.",
    precio: 90000,
    descuento: 0,
    imagen: "/img/Gucci.png",
    tallas: ["Única"],
    colores: ["Negro"],
    stock: 10,
    categoria: "Accesorios",
  },
  {
    id: 2,
    nombre: "Camiseta Supreme",
    descripcion: "Camiseta edición limitada Supreme.",
    precio: 250000,
    descuento: 0,
    imagen: "/img/camiseta-supreme.png",
    tallas: ["S", "M", "L"],
    colores: ["Blanco", "Negro"],
    stock: 8,
    categoria: "Camisetas",
  },
  {
    id: 3,
    nombre: "Tenis Luis guiton",
    descripcion: "Tenis de lujo para un estilo único.",
    precio: 340000,
    descuento: 0,
    imagen: "/img/zapatos.png",
    tallas: ["38", "39", "40", "41", "42"],
    colores: ["Blanco", "Negro"],
    stock: 5,
    categoria: "Calzado",
  },
  {
    id: 4,
    nombre: "Gorra Guffy",
    descripcion: "Gorra divertida con diseño de Guffy.",
    precio: 90000,
    descuento: 0,
    imagen: "/img/Goofy.png",
    tallas: ["Única"],
    colores: ["Azul"],
    stock: 7,
    categoria: "Accesorios",
  },
  {
    id: 5,
    nombre: "Camiseta ;)",
    descripcion: "Camiseta con diseño popular.",
    precio: 95000,
    descuento: 0,
    imagen: "/img/Camiseta-Roblox.png",
    tallas: ["S", "M", "L"],
    colores: ["Blanco", "Negro"],
    stock: 12,
    categoria: "Camisetas",
  },
  {
    id: 6,
    nombre: "Tacones en estratosfera",
    descripcion: "Tacones de moda para ocasiones especiales.",
    precio: 240000,
    descuento: 0,
    imagen: "/img/Tacones.png",
    tallas: ["36", "37", "38", "39"],
    colores: ["Rojo", "Negro"],
    stock: 4,
    categoria: "Calzado",
  },
  {
    id: 7,
    nombre: "Pantalones de Mariamoda",
    descripcion: "Pantalones de última tendencia.",
    precio: 64000,
    descuento: 0,
    imagen: "/img/Marimonda.png",
    tallas: ["S", "M", "L"],
    colores: ["Azul", "Negro"],
    stock: 9,
    categoria: "Pantalones",
  },
  {
    id: 8,
    nombre: "Pantalones 3 Piernas",
    descripcion: "¡Atrévete a ser diferente!",
    precio: 180000,
    descuento: 0,
    imagen: "/img/Tres-piernas.png",
    tallas: ["M", "L"],
    colores: ["Negro"],
    stock: 2,
    categoria: "Pantalones",
  },
  {
    id: 9,
    nombre: "Tenis Estratosféricos",
    descripcion: "Tenis con diseño innovador para destacar.",
    precio: 340000,
    descuento: 0,
    imagen: "/img/Teni.png",
    tallas: ["38", "39", "40", "41", "42"],
    colores: ["Blanco", "Negro"],
    stock: 6,
    categoria: "Calzado",
  },
];

const categorias = ["Camisetas", "Pantalones", "Accesorios", "Calzado"];

const tallasDisponibles = ["S", "M", "L", "XL"];

const coloresDisponibles = ["Blanco", "Negro", "Gris", "Azul", "Rojo"];

const PAGE_SIZE = 8;

const CatalogoProductos = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [filtro, setFiltro] = useState("");
  const [orden, setOrden] = useState("nuevo");
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState<
    string[]
  >([]);
  const [favoritos, setFavoritos] = useState<number[]>([]);
  const [tallasSeleccionadas, setTallasSeleccionadas] = useState<string[]>([]);
  const [coloresSeleccionados, setColoresSeleccionados] = useState<string[]>(
    []
  );
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");
  const [pagina, setPagina] = useState(1);
  const [colorDropdownOpen, setColorDropdownOpen] = useState(false);
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);

  const colorDropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { addToCart } = useUserCart();

  useEffect(() => {
    setProductos(mockProductos);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        colorDropdownRef.current &&
        !colorDropdownRef.current.contains(event.target as Node)
      ) {
        setColorDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const limpiarFiltros = () => {
    setFiltro("");
    setCategoriasSeleccionadas([]);
    setTallasSeleccionadas([]);
    setColoresSeleccionados([]);
    setPrecioMin("");
    setPrecioMax("");
    setPagina(1);
  };

  const filtrarProductos = () => {
    let filtrados = [...productos];
    if (categoriasSeleccionadas.length > 0) {
      filtrados = filtrados.filter((p) =>
        categoriasSeleccionadas.includes(p.categoria)
      );
    }
    if (filtro) {
      filtrados = filtrados.filter((p) =>
        p.nombre.toLowerCase().includes(filtro.toLowerCase())
      );
    }
    if (tallasSeleccionadas.length > 0) {
      filtrados = filtrados.filter((p) =>
        p.tallas.some((t) => tallasSeleccionadas.includes(t))
      );
    }
    if (coloresSeleccionados.length > 0) {
      filtrados = filtrados.filter((p) =>
        p.colores.some((c) => coloresSeleccionados.includes(c))
      );
    }
    if (precioMin) {
      filtrados = filtrados.filter((p) => p.precio >= Number(precioMin));
    }
    if (precioMax) {
      filtrados = filtrados.filter((p) => p.precio <= Number(precioMax));
    }
    if (orden === "nuevo") {
      filtrados = filtrados.sort((a, b) => b.id - a.id);
    }
    if (orden === "vendido") {
      filtrados = filtrados.sort((a, b) => a.id - b.id);
    }
    return filtrados;
  };

  const productosFiltrados = filtrarProductos();
  const totalPaginas = Math.ceil(productosFiltrados.length / PAGE_SIZE);
  const productosPagina = productosFiltrados.slice(
    (pagina - 1) * PAGE_SIZE,
    pagina * PAGE_SIZE
  );

  const toggleFavorito = (id: number) => {
    setFavoritos((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const handleCategoria = (cat: string) => {
    setCategoriasSeleccionadas((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
    setPagina(1);
  };
  const handleTalla = (t: string) => {
    setTallasSeleccionadas((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
    setPagina(1);
  };
  const handleColor = (c: string) => {
    setColoresSeleccionados((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
    setPagina(1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Header />
      <main className="flex-1 w-full max-w-md md:max-w-7xl mx-auto px-2 md:px-4 py-4 md:py-8">
        {/* Breadcrumb y orden */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <nav className="text-sm text-gray-600">
            <span className="font-semibold">Todos los productos</span>
          </nav>
        </div>
        {/* Filtros y orden arriba */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <label className="mr-1 text-gray-700">Ordenar por</label>
            <select
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="nuevo">Más nuevo</option>
              <option value="vendido">Más vendido</option>
            </select>
          </div>
          {/* Botón para mostrar filtros SOLO en móvil */}
          <button
            className="md:hidden px-3 py-1 bg-black text-white rounded"
            onClick={() => setFiltrosAbiertos(true)}
          >
            Categorías <span className="ml-1">&#9776;</span>
          </button>
        </div>
        {/* Resultados */}
        <div className="text-xs text-gray-500 mb-2">
          Mostrando{" "}
          {productosPagina.length > 0 ? (pagina - 1) * PAGE_SIZE + 1 : 0}-
          {(pagina - 1) * PAGE_SIZE + productosPagina.length} de{" "}
          {productosFiltrados.length} resultados
        </div>
        {/* Filtros laterales solo en desktop */}
        <div className="flex gap-0 md:gap-8">
          <aside className="hidden md:block w-60 shrink-0">
            <div className="mb-4 flex justify-between items-center">
              <h3 className="font-semibold">Filtros</h3>
              <button
                className="text-xs text-blue-600 underline"
                onClick={limpiarFiltros}
              >
                Limpiar filtros
              </button>
            </div>
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Categorías</h3>
              <ul className="space-y-1">
                {categorias.map((cat) => (
                  <li key={cat}>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={categoriasSeleccionadas.includes(cat)}
                        onChange={() => handleCategoria(cat)}
                        className="accent-primary"
                      />
                      <span>{cat}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Filtrar por precio</h3>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Mín"
                  value={precioMin}
                  onChange={(e) => setPrecioMin(e.target.value)}
                  className="border rounded px-2 py-1 w-20"
                  min={0}
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Máx"
                  value={precioMax}
                  onChange={(e) => setPrecioMax(e.target.value)}
                  className="border rounded px-2 py-1 w-20"
                  min={0}
                />
              </div>
            </div>
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Filtrar por talla</h3>
              <ul className="space-y-1">
                {tallasDisponibles.map((t) => (
                  <li key={t}>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tallasSeleccionadas.includes(t)}
                        onChange={() => handleTalla(t)}
                        className="accent-primary"
                      />
                      <span>{t}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-6" ref={colorDropdownRef}>
              <h3 className="font-semibold mb-2">Filtrar por color</h3>
              <button
                type="button"
                className="border rounded px-3 py-2 w-full text-left relative"
                onClick={() => setColorDropdownOpen((open) => !open)}
              >
                Color
                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                  &#9662;
                </span>
              </button>
              {colorDropdownOpen && (
                <div className="absolute z-10 mt-2 bg-white border rounded shadow w-52 p-2">
                  {coloresDisponibles.map((c) => (
                    <label
                      key={c}
                      className="flex items-center gap-2 cursor-pointer py-1"
                    >
                      <input
                        type="checkbox"
                        checked={coloresSeleccionados.includes(c)}
                        onChange={() => handleColor(c)}
                        className="accent-primary"
                      />
                      <span>{c}</span>
                    </label>
                  ))}
                </div>
              )}
              {/* Mostrar colores seleccionados */}
              <div className="flex flex-wrap gap-1 mt-2">
                {coloresSeleccionados.map((c) => (
                  <span
                    key={c}
                    className="bg-gray-200 rounded px-2 py-0.5 text-xs flex items-center gap-1"
                  >
                    {c}
                    <button
                      className="text-red-500"
                      onClick={() => handleColor(c)}
                      title="Quitar color"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </aside>
          {/* Filtros en modal para móvil */}
          {filtrosAbiertos && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex md:hidden">
              <div className="bg-white w-4/5 max-w-xs h-full p-4 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Filtros</h3>
                  <button
                    className="text-red-500 text-xl"
                    onClick={() => setFiltrosAbiertos(false)}
                  >
                    ×
                  </button>
                </div>
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Categorías</h3>
                  <ul className="space-y-1">
                    {categorias.map((cat) => (
                      <li key={cat}>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={categoriasSeleccionadas.includes(cat)}
                            onChange={() => handleCategoria(cat)}
                            className="accent-primary"
                          />
                          <span>{cat}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Filtrar por precio</h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Mín"
                      value={precioMin}
                      onChange={(e) => setPrecioMin(e.target.value)}
                      className="border rounded px-2 py-1 w-20"
                      min={0}
                    />
                    <span>-</span>
                    <input
                      type="number"
                      placeholder="Máx"
                      value={precioMax}
                      onChange={(e) => setPrecioMax(e.target.value)}
                      className="border rounded px-2 py-1 w-20"
                      min={0}
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Filtrar por talla</h3>
                  <ul className="space-y-1">
                    {tallasDisponibles.map((t) => (
                      <li key={t}>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={tallasSeleccionadas.includes(t)}
                            onChange={() => handleTalla(t)}
                            className="accent-primary"
                          />
                          <span>{t}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mb-6" ref={colorDropdownRef}>
                  <h3 className="font-semibold mb-2">Filtrar por color</h3>
                  <button
                    type="button"
                    className="border rounded px-3 py-2 w-full text-left relative"
                    onClick={() => setColorDropdownOpen((open) => !open)}
                  >
                    Color
                    <span className="absolute right-3 top-1/2 -translate-y-1/2">
                      &#9662;
                    </span>
                  </button>
                  {colorDropdownOpen && (
                    <div className="absolute z-10 mt-2 bg-white border rounded shadow w-52 p-2">
                      {coloresDisponibles.map((c) => (
                        <label
                          key={c}
                          className="flex items-center gap-2 cursor-pointer py-1"
                        >
                          <input
                            type="checkbox"
                            checked={coloresSeleccionados.includes(c)}
                            onChange={() => handleColor(c)}
                            className="accent-primary"
                          />
                          <span>{c}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  {/* Mostrar colores seleccionados */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {coloresSeleccionados.map((c) => (
                      <span
                        key={c}
                        className="bg-gray-200 rounded px-2 py-0.5 text-xs flex items-center gap-1"
                      >
                        {c}
                        <button
                          className="text-red-500"
                          onClick={() => handleColor(c)}
                          title="Quitar color"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div
                className="flex-1"
                onClick={() => setFiltrosAbiertos(false)}
              />
            </div>
          )}
          {/* Productos */}
          <section className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {productosPagina.length === 0 ? (
                <div className="col-span-full text-center text-gray-500 py-12">
                  No se encontraron productos.
                </div>
              ) : (
                productosPagina.map((producto) => (
                  <div
                    className="relative flex flex-col bg-white border rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => router.push(`/catalogo/${producto.id}`)}
                    key={producto.id}
                  >
                    <ProductCard
                      nombre={producto.nombre}
                      imagen={producto.imagen}
                      precio={producto.precio}
                      precioTachado={
                        producto.descuento > 0
                          ? producto.precio / (1 - producto.descuento / 100)
                          : undefined
                      }
                      descuento={producto.descuento}
                      descripcion={producto.descripcion}
                      onAddToCart={() =>
                        addToCart({
                          producto_id: producto.id,
                          nombre: producto.nombre,
                          imagen: producto.imagen,
                          talla: producto.tallas[0],
                          color: producto.colores[0],
                          precio: producto.precio,
                          cantidad: 1,
                          stock: producto.stock,
                        })
                      }
                      onToggleFavorite={() => toggleFavorito(producto.id)}
                      favorito={favoritos.includes(producto.id)}
                    />
                  </div>
                ))
              )}
            </div>
            {/* Paginación */}
            {totalPaginas > 1 && (
              <div className="flex gap-2 justify-center mt-8">
                <button
                  className="px-3 py-1 rounded border"
                  disabled={pagina === 1}
                  onClick={() => setPagina((p) => Math.max(1, p - 1))}
                >
                  &lt;
                </button>
                {[...Array(totalPaginas)].map((_, i) => (
                  <button
                    key={i}
                    className={`px-3 py-1 rounded border 
                      ${
                        pagina === i + 1
                          ? "bg-black text-white border-black"
                          : "border-black text-black bg-white"
                      }`}
                    onClick={() => setPagina(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="px-3 py-1 rounded border"
                  disabled={pagina === totalPaginas}
                  onClick={() =>
                    setPagina((p) => Math.min(totalPaginas, p + 1))
                  }
                >
                  &gt;
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CatalogoProductos;
