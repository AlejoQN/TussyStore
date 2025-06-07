"use client";
import { useRouter } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ProductCard from "@/components/products/productCard";

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
const masVendidos = [
  {
    id: 1,
    nombre: "Gorra Gucci",
    imagen: "/img/Gucci.png",
    precio: 90000,
    descripcion: "Gorra con diseño exclusivo y materiales premium.",
    masVendido: true,
  },
  {
    id: 2,
    nombre: "Camiseta Supreme",
    imagen: "/img/camiseta-supreme.png",
    precio: 250000,
    descripcion: "Camiseta edición limitada Supreme.",
    masVendido: true,
  },
  {
    id: 3,
    nombre: "Tenis Luis guiton",
    imagen: "/img/zapatos.png",
    precio: 340000,
    descripcion: "Tenis de lujo para un estilo único.",
    masVendido: true,
  },
];

const interesantes = [
  {
    id: 4,
    nombre: "Gorra Guffy",
    imagen: "/img/Goofy.png",
    precio: 90000,
    descripcion: "Gorra divertida con diseño de Guffy.",
  },
  {
    id: 5,
    nombre: "Camiseta ;)",
    imagen: "/img/Camiseta-Roblox.png",
    precio: 95000,
    descripcion: "Camiseta con diseño popular.",
  },
  {
    id: 6,
    nombre: "Tacones en estratosfera",
    imagen: "/img/Tacones.png",
    precio: 240000,
    descripcion: "Tacones de moda para ocasiones especiales.",
  },
  {
    id: 7,
    nombre: "Pantalones de Mariamoda",
    imagen: "/img/Marimonda.png",
    precio: 64000,
    descripcion: "Pantalones de última tendencia.",
  },
  {
    id: 8,
    nombre: "Pantalones 3 Piernas",
    imagen: "/img/Tres-piernas.png",
    precio: 180000,
    descripcion: "¡Atrévete a ser diferente!",
  },
  {
    id: 9,
    nombre: "Tenis Estratosféricos",
    imagen: "/img/Teni.png",
    precio: 340000,
    descripcion: "Tenis con diseño innovador para destacar.",
  },
];

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Header />
      {/* Banner principal */}
      <div className="w-full h-64 md:h-80 flex items-center justify-center mb-8">
        <img
          src="/img/Banner.png"
          alt="Banner Tussy Store"
          className="w-full h-full object-cover"
        />
      </div>
      <main className="flex-1 max-w-6xl mx-auto px-2 sm:px-4 py-8 w-full">
        {/* Bloque Lo más vendido */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Lo más vendido
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {masVendidos.map((prod) => (
              <div
                key={prod.id}
                className="cursor-pointer"
                onClick={() => router.push(`/catalogo/${prod.id}`)}
              >
                <ProductCard {...prod} />
              </div>
            ))}
          </div>
        </section>
        {/* Bloque Prendas más interesantes */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Prendas más interesantes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {interesantes.map((prod) => (
              <div
                key={prod.id}
                className="cursor-pointer"
                onClick={() => router.push(`/catalogo/${prod.id}`)}
              >
                <ProductCard {...prod} />
              </div>
            ))}
          </div>
        </section>
        {/* Banner inferior */}
        <div className="w-full h-40 md:h-56 flex items-center justify-center mt-8">
          <img
            src="/img/Banner.png"
            alt="Banner Tussy Store"
            className="w-full h-full object-cover"
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
