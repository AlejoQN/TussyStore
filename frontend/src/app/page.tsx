"use client";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ProductCard from "@/components/products/ProductCard";
import { useUserCart } from "@/hooks/userCart";
import { useState } from "react";

const masVendidos = [
  {
    producto_id: 1,
    nombre: "Gorra Gucci",
    imagen: "/img/Gucci.png",
    precio: 90000,
    descripcion: "Gorra con diseño exclusivo y materiales premium.",
    masVendido: true,
    stock: 10,
  },
  {
    producto_id: 2,
    nombre: "Camiseta Supreme",
    imagen: "/img/camiseta-supreme.png",
    precio: 250000,
    descripcion: "Camiseta edición limitada Supreme.",
    masVendido: true,
    stock: 10,
  },
  {
    producto_id: 3,
    nombre: "Tenis Luis guiton",
    imagen: "/img/zapatos.png",
    precio: 340000,
    descripcion: "Tenis de lujo para un estilo único.",
    masVendido: true,
    stock: 10,
  },
];

const interesantes = [
  {
    producto_id: 4,
    nombre: "Gorra Guffy",
    imagen: "/img/Goofy.png",
    precio: 90000,
    descripcion: "Gorra divertida con diseño de Guffy.",
    stock: 10,
  },
  {
    producto_id: 5,
    nombre: "Camiseta ;)",
    imagen: "/img/Camiseta-Roblox.png",
    precio: 95000,
    descripcion: "Camiseta con diseño popular.",
    stock: 10,
  },
  {
    producto_id: 6,
    nombre: "Tacones en estratosfera",
    imagen: "/img/Tacones.png",
    precio: 240000,
    descripcion: "Tacones de moda para ocasiones especiales.",
    stock: 10,
  },
  {
    producto_id: 7,
    nombre: "Pantalones de Mariamoda",
    imagen: "/img/Marimonda.png",
    precio: 64000,
    descripcion: "Pantalones de última tendencia.",
    stock: 10,
  },
  {
    producto_id: 8,
    nombre: "Pantalones 3 Piernas",
    imagen: "/img/Tres-piernas.png",
    precio: 180000,
    descripcion: "¡Atrévete a ser diferente!",
    stock: 10,
  },
  {
    producto_id: 9,
    nombre: "Tenis Estratosféricos",
    imagen: "/img/Teni.png",
    precio: 340000,
    descripcion: "Tenis con diseño innovador para destacar.",
    stock: 10,
  },
];

export default function Home() {
  const { addToCart } = useUserCart();
  const [showMsg, setShowMsg] = useState(false);

  // Handler para agregar al carrito
  const handleAddToCart = (prod: any) => {
    addToCart({
      producto_id: prod.producto_id,
      nombre: prod.nombre,
      imagen: prod.imagen,
      precio: prod.precio,
      cantidad: 1,
      talla: prod.talla || undefined,
      color: prod.color || undefined,
      stock: prod.stock || 10,
    });
    setShowMsg(true);
    setTimeout(() => setShowMsg(false), 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Header />
      {/* Mensaje de agregado al carrito */}
      {showMsg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-pink-500 text-white px-6 py-3 rounded shadow-lg font-semibold transition-all">
          ¡Producto agregado al carrito!
        </div>
      )}
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
            {masVendidos.map((prod, i) => (
              <ProductCard
                key={i}
                {...prod}
                onAddToCart={() => handleAddToCart(prod)}
              />
            ))}
          </div>
        </section>
        {/* Bloque Prendas más interesantes */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Prendas más interesantes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {interesantes.map((prod, i) => (
              <ProductCard
                key={i}
                {...prod}
                onAddToCart={() => handleAddToCart(prod)}
              />
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
