"use client";
import { useRouter } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useEffect, useState } from "react";
import axios from "axios";
import { useUserCart } from "@/hooks/userCart";
import { useFavoritos } from "@/hooks/useFavoritos";
import ProductCard from "@/components/products/productCard";

export default function Home() {
  const router = useRouter();
  const { addToCart } = useUserCart();
  const { favoritos, addFavorito, removeFavorito, isFavorito } = useFavoritos();
  const [destacados, setDestacados] = useState<any[]>([]);
  const [masVendidos, setMasVendidos] = useState<any[]>([]);
  const [interesantes, setInteresantes] = useState<any[]>([]);

  useEffect(() => {
    axios.get("/api/productos?destacados=true").then((res) => {
      setDestacados(
        res.data.items.map((p: any) => ({
          ...p,
          imagen: p.imagen
            ? p.imagen.startsWith("http")
              ? p.imagen
              : `/uploads/${p.imagen.replace(/^\/?uploads\//, "")}`
            : "/img/no-image.png",
          precio: Number(p.precio),
          tallas:
            typeof p.tallas === "string"
              ? p.tallas.split(",").map((t: string) => t.trim())
              : [],
          colores:
            typeof p.colores === "string"
              ? p.colores.split(",").map((c: string) => c.trim())
              : [],
        }))
      );
    });
    axios.get("/api/productos?masVendidos=true").then((res) => {
      setMasVendidos(
        res.data.items.map((p: any) => ({
          ...p,
          imagen: p.imagen
            ? p.imagen.startsWith("http")
              ? p.imagen
              : `/uploads/${p.imagen.replace(/^\/?uploads\//, "")}`
            : "/img/no-image.png",
          precio: Number(p.precio),
          tallas:
            typeof p.tallas === "string"
              ? p.tallas.split(",").map((t: string) => t.trim())
              : [],
          colores:
            typeof p.colores === "string"
              ? p.colores.split(",").map((c: string) => c.trim())
              : [],
        }))
      );
    });
    axios.get("/api/productos?interesantes=true").then((res) => {
      setInteresantes(
        res.data.items.map((p: any) => ({
          ...p,
          imagen: p.imagen
            ? p.imagen.startsWith("http")
              ? p.imagen
              : `/uploads/${p.imagen.replace(/^\/?uploads\//, "")}`
            : "/img/no-image.png",
          precio: Number(p.precio),
          tallas:
            typeof p.tallas === "string"
              ? p.tallas.split(",").map((t: string) => t.trim())
              : [],
          colores:
            typeof p.colores === "string"
              ? p.colores.split(",").map((c: string) => c.trim())
              : [],
        }))
      );
    });
  }, []);

  const productosAdaptados = [
    ...masVendidos,
    ...interesantes,
    ...destacados,
  ].map((p: any) => ({
    ...p,
    imagen: p.imagen
      ? p.imagen.startsWith("http")
        ? p.imagen
        : `/uploads/${p.imagen.replace(/^\/?uploads\//, "")}`
      : "/img/no-image.png",
    precio: Number(p.precio),
    tallas:
      typeof p.tallas === "string"
        ? p.tallas.split(",").map((t: string) => t.trim())
        : [],
    colores:
      typeof p.colores === "string"
        ? p.colores.split(",").map((c: string) => c.trim())
        : [],
  }));

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
            {productosAdaptados.map((prod, idx) => (
              <div
                key={`${prod.id}-${idx}`}
                className="cursor-pointer"
                onClick={() => router.push(`/catalogo/${prod.id}`)}
              >
                <ProductCard
                  {...prod}
                  favorito={isFavorito(prod.id)}
                  onToggleFavorite={(e: React.MouseEvent) => {
                    e?.stopPropagation?.();
                    isFavorito(prod.id)
                      ? removeFavorito(prod.id)
                      : addFavorito(prod.id);
                  }}
                  onAddToCart={() =>
                    addToCart({
                      producto_id: prod.id,
                      nombre: prod.nombre,
                      imagen: prod.imagen,
                      talla: prod.tallas?.[0] || "",
                      color: prod.colores?.[0] || "",
                      precio: prod.precio,
                      cantidad: 1,
                      stock: prod.stock,
                    })
                  }
                />
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
                <ProductCard
                  {...prod}
                  onAddToCart={() =>
                    addToCart({
                      producto_id: prod.id,
                      nombre: prod.nombre,
                      imagen: prod.imagen,
                      talla: prod.tallas?.[0] || "",
                      color: prod.colores?.[0] || "",
                      precio: prod.precio,
                      cantidad: 1,
                      stock: prod.stock,
                    })
                  }
                />
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
