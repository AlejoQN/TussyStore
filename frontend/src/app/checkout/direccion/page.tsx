"use client";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useCheckout } from "../checkoutContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUserCart } from "@/hooks/userCart";
import axios from "axios";

const STORAGE_KEY = "tussy_address";

export default function DireccionPage() {
  const { setDireccion } = useCheckout();
  const router = useRouter();
  const { token } = useAuth();

  type Direccion = {
    id: number;
    nombre: string;
    direccion: string;
    departamento: string;
    municipio: string;
    barrio?: string;
    apartamento?: string;
    indicaciones?: string;
    telefono: string;
    ciudad?: string;
    [key: string]: any; // For any extra fields
  };

  const [direccionesGuardadas, setDireccionesGuardadas] = useState<Direccion[]>(
    []
  );
  const [direccionSeleccionada, setDireccionSeleccionada] = useState<
    number | null
  >(null);

  // Cargar dirección guardada si existe
  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    departamento: "",
    municipio: "",
    barrio: "",
    apartamento: "",
    indicaciones: "",
    telefono: "",
    guardar: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setForm(JSON.parse(saved));
  }, []);

  // Guardar dirección en localStorage al cambiar
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
  }, [form]);

  // Obtener carrito real del usuario
  const { items } = useUserCart();

  // Calcular subtotal, envio y total localmente
  const subtotal = items.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );
  const envio = subtotal > 100000 ? 0 : 10000; // Ejemplo: envío gratis sobre 100.000
  const total = subtotal + envio;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.guardar && token) {
      await axios.post("/api/direcciones", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    setDireccion({
      ...form,
      codigoPostal: "", // o el valor real si lo tienes
      ciudad: form.municipio || "",
      calle: form.direccion || "",
    });
    router.push("/checkout/pago");
  };

  // Cuando el usuario selecciona una dirección guardada:
  const handleSeleccionarDireccion = (id: number) => {
    setDireccionSeleccionada(id);
    const dir = direccionesGuardadas.find((d) => d.id === id);
    if (dir)
      setForm({
        nombre: dir.nombre || "",
        direccion: dir.direccion || "",
        departamento: dir.departamento || "",
        municipio: dir.municipio || "",
        barrio: dir.barrio || "",
        apartamento: dir.apartamento || "",
        indicaciones: dir.indicaciones || "",
        telefono: dir.telefono || "",
        guardar: false,
      });
  };

  useEffect(() => {
    if (!token) return;
    axios
      .get("/api/direcciones", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setDireccionesGuardadas(res.data.direcciones))
      .catch(() => setDireccionesGuardadas([]));
  }, [token]);

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <Header />
      <div className="max-w-5xl mx-auto py-8 px-2 sm:px-4">
        <h1 className="text-2xl font-bold mb-6 mt-2">Dirección de envío</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Columna principal */}
          <div className="flex-1 min-w-0">
            {/* Tabs de pasos */}
            <div className="flex gap-0 mb-6 border-b border-gray-200 flex-wrap">
              <div className="flex-1 text-center py-2 border-b-2 border-primary font-semibold text-primary bg-white min-w-[120px]">
                <span className="inline-flex items-center gap-2">
                  <span className="inline-block w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">
                    1
                  </span>
                  Dirección
                </span>
              </div>
              <div className="flex-1 text-center py-2 border-b-2 border-gray-200 text-gray-400 bg-gray-50 min-w-[120px]">
                <span className="inline-flex items-center gap-2">
                  <span className="inline-block w-5 h-5 rounded-full bg-gray-300 text-gray-600 text-xs flex items-center justify-center font-bold">
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
            {/* Formulario */}
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl shadow border border-gray-200 p-4 sm:p-6 mt-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div>
                  <label
                    htmlFor="direccion"
                    className="block text-xs font-semibold mb-1"
                  >
                    Dirección
                  </label>
                  <input
                    type="text"
                    name="direccion"
                    id="direccion"
                    value={form.direccion}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    placeholder="Ej: Calle 42C #43-123 Sur"
                  />
                </div>
                <div>
                  <label
                    htmlFor="departamento"
                    className="block text-xs font-semibold mb-1"
                  >
                    Departamento
                  </label>
                  <input
                    type="text"
                    name="departamento"
                    id="departamento"
                    value={form.departamento}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    placeholder="Departamento"
                  />
                </div>
                <div>
                  <label
                    htmlFor="municipio"
                    className="block text-xs font-semibold mb-1"
                  >
                    Municipio
                  </label>
                  <input
                    type="text"
                    name="municipio"
                    id="municipio"
                    value={form.municipio}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    placeholder="Municipio"
                  />
                </div>
                <div>
                  <label
                    htmlFor="barrio"
                    className="block text-xs font-semibold mb-1"
                  >
                    Barrio
                  </label>
                  <input
                    type="text"
                    name="barrio"
                    id="barrio"
                    value={form.barrio}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    placeholder="Barrio"
                  />
                </div>
                <div>
                  <label
                    htmlFor="apartamento"
                    className="block text-xs font-semibold mb-1"
                  >
                    N° Apartamento/Casa (Opcional)
                  </label>
                  <input
                    type="text"
                    name="apartamento"
                    id="apartamento"
                    value={form.apartamento}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    placeholder="N° Apartamento/Casa"
                  />
                </div>
                <div className="md:col-span-2">
                  <label
                    htmlFor="indicaciones"
                    className="block text-xs font-semibold mb-1"
                  >
                    Indicaciones para la entrega (Opcional)
                  </label>
                  <input
                    type="text"
                    name="indicaciones"
                    id="indicaciones"
                    value={form.indicaciones}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    placeholder="Ej: color de edificio, no tiene timbre, etc."
                  />
                </div>
              </div>
              <div className="mb-3">
                <div className="text-xs font-semibold mb-1">
                  Datos de contacto
                </div>
                <input
                  type="text"
                  name="nombre"
                  id="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-2"
                  placeholder="Nombre y Apellido"
                />
                <input
                  type="tel"
                  name="telefono"
                  id="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  placeholder="Teléfono"
                />
              </div>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  name="guardar"
                  id="guardar"
                  checked={form.guardar}
                  onChange={handleChange}
                  className="accent-primary mr-2"
                />
                <label htmlFor="guardar" className="text-xs">
                  ¿Deseas guardar esta dirección?
                </label>
              </div>
              <button
                type="submit"
                className="bg-dark text-white px-8 py-2 rounded font-semibold w-full text-base"
              >
                Continuar
              </button>
            </form>
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">
                Selecciona una dirección de envío
              </h3>
              <div className="flex gap-4 flex-wrap">
                {direccionesGuardadas.length === 0 ? (
                  <div className="text-gray-500 text-sm">
                    No tienes direcciones guardadas.
                  </div>
                ) : (
                  direccionesGuardadas.map((dir) => (
                    <div
                      key={dir.id}
                      className={`border rounded p-3 cursor-pointer transition-all flex-1 min-w-[250px] ${
                        direccionSeleccionada === dir.id
                          ? "border-black bg-gray-50"
                          : "border-transparent"
                      }`}
                      onClick={() => handleSeleccionarDireccion(dir.id)}
                    >
                      <input
                        type="checkbox"
                        checked={direccionSeleccionada === dir.id}
                        onChange={() => handleSeleccionarDireccion(dir.id)}
                        className="accent-primary mr-2"
                      />
                      <div className="flex-1">
                        <div className="font-bold">{dir.nombre}</div>
                        <div className="text-xs">
                          {dir.direccion}, {dir.ciudad}, {dir.departamento}
                        </div>
                        <div className="text-xs">{dir.telefono}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          {/* Resumen de compra */}
          <div className="w-full lg:w-80 shrink-0 mt-8 lg:mt-0">
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
      </div>
      <Footer />
    </div>
  );
}
