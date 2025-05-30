"use client";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useCheckout } from "../checkoutContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUserCart } from "@/hooks/userCart";

const metodos = [
  { id: "mercadopago", nombre: "Mercado Pago" },
  { id: "bancolombia", nombre: "Bancolombia" },
  { id: "nequi", nombre: "Nequi" },
  { id: "contraentrega", nombre: "Pago contra entrega" },
];

export default function MetodoPago() {
  const { setMetodoPago } = useCheckout();
  const router = useRouter();
  const [metodo, setMetodo] = useState("");
  const { items } = useUserCart();

  // Calcula el subtotal, envio y total localmente
  const subtotal = items.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );
  const envio = subtotal >= 100000 || items.length === 0 ? 0 : 10000; // ejemplo: envío gratis desde 100.000
  const total = subtotal + envio;

  // Simulación de QR (en producción, obtén el QR real del backend)
  const qrBancolombia =
    "https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=BancolombiaPago";
  const qrNequi =
    "https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=NequiPago";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (metodo) {
      setMetodoPago(metodo as any);
      router.push("/checkout/revision");
    }
  };

  const handleMercadoPago = () => {
    // Aquí deberías redirigir al usuario al link de pago real de MercadoPago
    window.open("https://link.mercadopago.com.co/tussystore", "_blank");
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <Header />
      <div className="max-w-5xl mx-auto py-8 px-2 sm:px-4 flex flex-col md:flex-row gap-8">
        {/* Columna principal */}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold mb-6 mt-2">Método de pago</h1>
          {/* Tabs de pasos */}
          <div className="flex gap-0 mb-6 border-b border-gray-200 flex-wrap">
            <div className="flex-1 text-center py-2 border-b-2 border-gray-200 text-gray-400 bg-gray-50 min-w-[120px]">
              <span className="inline-flex items-center gap-2">
                <span className="inline-block w-5 h-5 rounded-full bg-gray-300 text-gray-600 text-xs flex items-center justify-center font-bold">
                  1
                </span>
                Dirección
              </span>
            </div>
            <div className="flex-1 text-center py-2 border-b-2 border-primary font-semibold text-primary bg-white min-w-[120px]">
              <span className="inline-flex items-center gap-2">
                <span className="inline-block w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">
                  2
                </span>
                Método de pago
              </span>
            </div>
            <div className="flex-1 text-center py-2 border-b-2 border-gray-200 text-gray-400 bg-gray-50 min-w-[120px]">
              <span className="inline-flex items-center gap-2">
                <span className="inline-block w-5 h-5 rounded-full bg-gray-300 text-gray-600 text-xs flex items-center justify-center font-bold">
                  3
                </span>
                Revisión del pedido
              </span>
            </div>
          </div>
          {/* Formulario de métodos de pago */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow border border-gray-200 p-4 sm:p-6 mt-6"
          >
            <div className="font-semibold mb-3">
              Selecciona un método de pago
            </div>
            <div className="flex flex-col gap-4">
              {metodos.map((m) => (
                <div
                  key={m.id}
                  className="border-b last:border-b-0 border-gray-200 pb-4 last:pb-0"
                >
                  <label className="flex items-center gap-2 cursor-pointer font-semibold">
                    <input
                      type="radio"
                      name="metodo"
                      value={m.id}
                      checked={metodo === m.id}
                      onChange={() => setMetodo(m.id)}
                      className="accent-primary"
                      required
                    />
                    {m.nombre}
                  </label>
                  {/* Renderiza el contenido especial según el método */}
                  {metodo === "mercadopago" && m.id === "mercadopago" && (
                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={handleMercadoPago}
                        className="bg-dark text-white px-6 py-2 rounded font-semibold"
                      >
                        Pagar con Mercado Pago
                      </button>
                    </div>
                  )}
                  {metodo === "bancolombia" && m.id === "bancolombia" && (
                    <div className="mt-3">
                      <img
                        src={qrBancolombia}
                        alt="QR Bancolombia"
                        className="h-28 w-28"
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        Escanea el QR con tu app Bancolombia
                      </div>
                    </div>
                  )}
                  {metodo === "nequi" && m.id === "nequi" && (
                    <div className="mt-3">
                      <img src={qrNequi} alt="QR Nequi" className="h-28 w-28" />
                      <div className="text-xs text-gray-500 mt-1">
                        Escanea el QR con tu app Nequi
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button
              type="submit"
              className="bg-dark text-white px-8 py-2 rounded font-semibold w-full text-base mt-6"
            >
              Continuar
            </button>
          </form>
        </div>
        {/* Resumen de compra */}
        <div className="w-full md:w-80 shrink-0 mt-8 md:mt-0">
          <div className="bg-white rounded-xl shadow border border-gray-200 p-4 sm:p-6 mb-4">
            <div className="font-bold mb-2">Resumen del carrito</div>
            {items.length === 0 ? (
              <div className="text-gray-500 text-sm">
                Tu carrito está vacío.
              </div>
            ) : (
              <ul className="mb-3 divide-y divide-gray-100">
                {items.map((item) => (
                  <li key={item.id} className="py-2 flex flex-col">
                    <span className="font-medium">{item.nombre}</span>
                    <span className="text-xs text-gray-500">
                      {item.talla && <>Talla: {item.talla} </>}
                      {item.color && <>| Color: {item.color} </>}x
                      {item.cantidad}
                    </span>
                    <span className="text-xs text-gray-700">
                      ${item.precio.toLocaleString()} c/u
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>${subtotal?.toLocaleString() ?? "0"}</span>
            </div>
            <div className="flex justify-between font-bold text-base border-t pt-2">
              <span>Total</span>
              <span>${subtotal?.toLocaleString() ?? "0"}</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
