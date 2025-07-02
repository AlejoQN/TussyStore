"use client";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useCheckout } from "../checkoutContext";
import { useRouter } from "next/navigation";
import { useUserCart } from "@/hooks/userCart";
import api from "@/utils/axios";
import { useMemo, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

// Utilidad simple para estimar días de entrega según ciudad/municipio
function estimarDiasEntrega(destino: string) {
  if (!destino) return 5;
  const destinoLower = destino.toLowerCase();
  if (
    destinoLower.includes("medellín") ||
    destinoLower.includes("medellin") ||
    destinoLower.includes("itagüí") ||
    destinoLower.includes("itagui") ||
    destinoLower.includes("sabaneta") ||
    destinoLower.includes("envigado")
  ) {
    return 1;
  }
  if (destinoLower.includes("antioquia")) {
    return 2;
  }
  // Otros departamentos/ciudades
  return 4;
}

export default function RevisionPedido() {
  const { direccion, metodoPago, reset } = useCheckout();
  const router = useRouter();
  const { items } = useUserCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { token } = useAuth(); // o como obtengas el token
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calcular subtotal, envio y total localmente
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.precio * item.cantidad, 0),
    [items]
  );
  // Ejemplo: envío gratis si subtotal > 100000, si no $10000
  const envio = subtotal > 100000 || items.length === 0 ? 0 : 10000;
  const total = subtotal + envio;

  // Calcular fecha estimada de llegada
  const diasEntrega = useMemo(
    () =>
      direccion
        ? estimarDiasEntrega(
            direccion.municipio ||
              direccion.ciudad ||
              direccion.departamento ||
              ""
          )
        : 5,
    [direccion]
  );
  const fechaEstimada = useMemo(() => {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + diasEntrega);
    return fecha.toLocaleDateString("es-CO", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, [diasEntrega]);

  const handleConfirmar = async () => {
    setLoading(true);
    setError("");
    try {
      await api.post(
        "/ordenes",
        {
          direccion,
          metodoPago,
          items,
        },
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      );
      // Redirige a la página de confirmación (pop-up o página)
      router.push("/checkout/orden-confirmada");
    } catch (err) {
      setError("No se pudo procesar el pedido. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    // Opcional: puedes mostrar un loader aquí
    return null;
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <Header />
      <div className="max-w-5xl mx-auto py-8 px-2 sm:px-4 flex flex-col md:flex-row gap-8">
        {/* Columna principal */}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold mb-6 mt-2">Revisión del pedido</h1>
          {/* Tabs de pasos */}
          <div className="flex gap-0 mb-6 border-b border-gray-200 flex-wrap">
            <div className="flex-1 text-center py-2 border-b-2 border-gray-200 text-gray-400 bg-gray-50 min-w-[120px] text-xs sm:text-base">
              <span className="inline-flex items-center gap-2">
                <span className="inline-block w-5 h-5 rounded-full bg-gray-300 text-gray-600 text-xs flex items-center justify-center font-bold">
                  1
                </span>
                Dirección
              </span>
            </div>
            <div className="flex-1 text-center py-2 border-b-2 border-gray-200 text-gray-400 bg-gray-50 min-w-[120px] text-xs sm:text-base">
              <span className="inline-flex items-center gap-2">
                <span className="inline-block w-5 h-5 rounded-full bg-gray-300 text-gray-600 text-xs flex items-center justify-center font-bold">
                  2
                </span>
                Método de pago
              </span>
            </div>
            <div className="flex-1 text-center py-2 border-b-2 border-primary font-semibold text-primary bg-white min-w-[120px] text-xs sm:text-base">
              <span className="inline-flex items-center gap-2">
                <span className="inline-block w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">
                  3
                </span>
                Revisión del pedido
              </span>
            </div>
          </div>
          {/* Llegada estimada */}
          <div className="font-semibold mb-4 text-sm sm:text-base">
            Llegada estimada: {fechaEstimada}
          </div>
          {/* Productos */}
          <div className="mb-6">
            {items.length === 0 ? (
              <div className="text-gray-500 text-sm">
                Tu carrito está vacío.
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {items.map((p, i) => (
                  <li
                    key={i}
                    className="flex flex-col xs:flex-row items-start xs:items-center gap-4 py-4"
                  >
                    <img
                      src={p.imagen}
                      alt={p.nombre}
                      className="h-16 w-16 object-contain rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold break-words">{p.nombre}</div>
                      <div className="text-xs text-gray-600">
                        {p.talla && <>Talla: {p.talla} </>}
                        {p.color && <>| Color: {p.color}</>}
                      </div>
                    </div>
                    <div className="text-right min-w-[80px]">
                      <div className="font-semibold">
                        ${p.precio.toLocaleString("es-CO")}
                      </div>
                      <div className="text-xs text-gray-500">x{p.cantidad}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Dirección de envío */}
          <div className="border-t border-gray-200 pt-4 mb-4">
            <div className="font-semibold mb-1">Dirección de envío</div>
            {direccion ? (
              <div>
                <div className="font-bold">{direccion.nombre}</div>
                <div className="text-sm text-gray-700 break-words">
                  {direccion.direccion}
                  {direccion.apartamento && `, ${direccion.apartamento}`}
                  <br />
                  {direccion.barrio && `${direccion.barrio}, `}
                  {direccion.municipio}, {direccion.departamento}
                  <br />
                  {direccion.telefono}
                </div>
                <button
                  type="button"
                  className="mt-2 px-3 py-1 text-xs border rounded bg-gray-100 hover:bg-gray-200 flex items-center gap-1"
                  onClick={() => router.push("/checkout/direccion")}
                >
                  <span className="i-mdi-pencil-outline" /> Editar
                </button>
              </div>
            ) : (
              <div className="text-gray-500 text-sm">No especificada</div>
            )}
          </div>
          {/* Método de pago */}
          <div className="border-t border-gray-200 pt-4 mb-4">
            <div className="font-semibold mb-1">Método de pago</div>
            <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2">
              <span className="font-bold capitalize">{metodoPago}</span>
              <button
                type="button"
                className="px-3 py-1 text-xs border rounded bg-gray-100 hover:bg-gray-200 flex items-center gap-1"
                onClick={() => router.push("/checkout/pago")}
              >
                <span className="i-mdi-pencil-outline" /> Editar
              </button>
            </div>
          </div>
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
                    <span className="font-medium break-words">
                      {item.nombre}
                    </span>
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
            <div className="flex justify-between mb-2 text-sm">
              <span>Subtotal</span>
              <span>
                {typeof subtotal === "number"
                  ? `$${subtotal.toLocaleString("es-CO")}`
                  : "$0"}
              </span>
            </div>
            <div className="flex justify-between mb-2 text-sm">
              <span>Envío</span>
              <span>
                {typeof envio === "number"
                  ? envio === 0
                    ? "Gratis"
                    : `$${envio.toLocaleString("es-CO")}`
                  : "$0"}
              </span>
            </div>
            <div className="flex justify-between font-bold text-base border-t pt-2">
              <span>Total</span>
              <span>
                {typeof total === "number"
                  ? `$${total.toLocaleString("es-CO")}`
                  : "$0"}
              </span>
            </div>
            <button
              onClick={handleConfirmar}
              className="mt-4 bg-dark text-white px-8 py-2 rounded font-semibold w-full text-base"
              disabled={loading}
            >
              {loading ? "Procesando..." : "Ordenar"}
            </button>
            {error && <div className="text-red-500 mt-2">{error}</div>}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
