"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useUserCart } from "@/hooks/userCart";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart } = useUserCart();

  // Calcular subtotal
  const subtotal = items.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0
  );

  return (
    <div className="min-h-screen flex flex-col bg-white text-black font-sans">
      <Header />
      <div className="flex-1">
        <div>
    {items.map(item => (
      <div key={item.id}>{item.nombre}</div>
    ))}
  </div>
        <div className="max-w-6xl mx-auto py-8 px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Lista de productos */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Carrito</h2>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 text-sm text-gray-600">
                  <th className="py-2">Productos</th>
                  <th className="py-2">Precio</th>
                  <th className="py-2">Cantidad</th>
                  <th className="py-2">Subtotal</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">
                      Tu carrito está vacío.
                    </td>
                  </tr>
                )}
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-4 flex gap-3 items-center">
                      <img
                        src={item.imagen}
                        alt={item.nombre}
                        className="w-16 h-16 object-contain rounded"
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
                      ${item.precio.toLocaleString()}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center border rounded w-fit">
                        <button
                          type="button"
                          className="px-2 py-1 text-lg font-bold"
                          onClick={() =>
                            updateQuantity(item.id, item.cantidad - 1)
                          }
                          disabled={item.cantidad <= 1}
                        >
                          -
                        </button>
                        <span className="px-3">{item.cantidad}</span>
                        <button
                          type="button"
                          className="px-2 py-1 text-lg font-bold"
                          onClick={() =>
                            updateQuantity(item.id, item.cantidad + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="py-4 font-medium">
                      ${(item.precio * item.cantidad).toLocaleString()}
                    </td>
                    <td className="py-4">
                      <button
                        className="text-red-500 hover:bg-red-100 rounded p-2"
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Eliminar producto"
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
                ))}
              </tbody>
            </table>
          </div>
          {/* Resumen de compra */}
          <div className="w-full md:w-80 shrink-0">
            <div className="bg-white rounded-xl shadow border border-gray-200 p-6 mb-4">
              <div className="font-bold mb-2">Subtotal</div>
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              {/* El costo de envío NO se muestra aquí */}
              <div className="flex justify-between font-bold text-base border-t pt-2">
                <span>Total</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <Link
                href="/checkout/direccion"
                className="mt-4 bg-dark text-white px-8 py-2 rounded font-semibold w-full text-base block text-center"
              >
                Proceder con el pago
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
