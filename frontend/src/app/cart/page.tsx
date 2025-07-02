"use client";
import React, { useState, useEffect } from "react";
import { useUserCart } from "@/hooks/userCart";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import api from "@/utils/axios";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { items, updateQuantity, removeFromCart } = useUserCart();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await api.get("/carrito");
      } catch (error) {
        console.error("Error al obtener el carrito:", error);
      }
    };

    fetchData();
  }, []);

  if (!mounted) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0
  );
  const envio = subtotal > 100000 || items.length === 0 ? 0 : 10000;
  const total = subtotal + envio;

  return (
    <div className="min-h-screen flex flex-col bg-white text-black font-sans">
      <Header />
      <div className="flex-1">
        <div className="max-w-6xl mx-auto py-8 px-2 sm:px-4 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Lista de productos */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Carrito</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[400px]">
                <thead>
                  <tr className="border-b border-gray-200 text-sm text-gray-600">
                    <th className="py-2">Producto</th>
                    <th className="py-2">Precio</th>
                    <th className="py-2">Cantidad</th>
                    <th className="py-2">Subtotal</th>
                    <th className="py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-12 text-gray-500"
                      >
                        <div className="flex flex-col items-center gap-4">
                          <span className="text-2xl">🛒</span>
                          <span>Tu carrito está vacío.</span>
                          <Link
                            href="/catalogo"
                            className="mt-2 px-6 py-2 bg-black text-white rounded font-semibold hover:bg-gray-800 transition"
                          >
                            Ir al catálogo
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    items.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100">
                        <td className="py-4 flex gap-3 items-center min-w-[180px]">
                          <img
                            src={item.imagen}
                            alt={item.nombre}
                            className="w-16 h-16 object-contain rounded border"
                          />
                          <div>
                            <div className="font-semibold">{item.nombre}</div>
                            <div className="text-xs text-gray-500">
                              {item.talla && <>Talla: {item.talla} </>}
                              {item.color && <>| Color: {item.color}</>}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 font-medium">
                          ${item.precio.toLocaleString("es-CO")}
                        </td>
                        <td className="py-4">
                          <div className="flex items-center border rounded w-fit">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.id, item.cantidad - 1)
                              }
                              disabled={item.cantidad <= 1}
                              className="px-2 py-1 text-lg font-bold cursor-pointer disabled:opacity-50"
                              aria-label="Disminuir cantidad"
                            >
                              -
                            </button>
                            <span className="px-3">{item.cantidad}</span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.id, item.cantidad + 1)
                              }
                              disabled={item.cantidad >= item.stock}
                              className="px-2 py-1 text-lg font-bold cursor-pointer disabled:opacity-50"
                              aria-label="Aumentar cantidad"
                            >
                              +
                            </button>
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            Stock: {item.stock}
                          </div>
                        </td>
                        <td className="py-4 font-medium">
                          $
                          {(item.precio * item.cantidad).toLocaleString(
                            "es-CO"
                          )}
                        </td>
                        <td className="py-4">
                          <button
                            className="text-red-500 hover:bg-red-100 rounded p-2"
                            onClick={() => removeFromCart(item.id)}
                            aria-label="Eliminar producto"
                            title="Eliminar producto"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
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
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {/* Resumen de compra */}
          <div className="w-full md:w-80 shrink-0">
            <div className="bg-white rounded-xl shadow border border-gray-200 p-4 sm:p-6 mb-4">
              <div className="font-bold mb-2">Resumen de compra</div>
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString("es-CO")}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Envío</span>
                <span>
                  {envio === 0 ? "Gratis" : `$${envio.toLocaleString("es-CO")}`}
                </span>
              </div>
              <div className="flex justify-between font-bold text-base border-t pt-2">
                <span>Total</span>
                <span>${total.toLocaleString("es-CO")}</span>
              </div>
              <Link
                href={items.length === 0 ? "/catalogo" : "/checkout/direccion"}
                className={`mt-4 px-8 py-2 rounded font-semibold w-full text-base block text-center ${
                  items.length === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
                tabIndex={items.length === 0 ? -1 : 0}
                aria-disabled={items.length === 0}
              >
                Proceder con el pago
              </Link>
            </div>
            <div className="text-xs text-gray-500 text-center">
              Puedes eliminar productos, modificar cantidades o volver al
              catálogo antes de pagar.
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
