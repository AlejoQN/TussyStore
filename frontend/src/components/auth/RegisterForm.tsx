"use client";
import React, { useState } from "react";
import Link from "next/link";

const initialState = {
  nombres: "",
  apellidos: "",
  email: "",
  edad: "",
  password: "",
  confirmPassword: "",
  acceptTerms: false,
  rol: "cliente",
};

export default function RegisterForm() {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showTerms, setShowTerms] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (!form.acceptTerms) {
      setError("Debes aceptar los Términos y Políticas.");
      return;
    }
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: `${form.nombres} ${form.apellidos}`,
          email: form.email,
          password: form.password,
          edad: form.edad,
          rol: form.rol,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error en el registro");
      setSuccess("¡Cuenta creada correctamente!");
      setForm(initialState);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-white">
      {/* Logo esquina superior izquierda */}
      <Link
        href="/"
        className="absolute top-8 left-8 w-24"
        style={{ width: 90 }}
      >
        <img
          src="/img/Logo-2.png"
          alt="Logo"
          className="w-24"
          style={{ width: 90 }}
        />
      </Link>
      {/* Botón cerrar */}
      <button
        aria-label="Cerrar"
        className="absolute top-8 right-8 text-black text-4xl font-light hover:opacity-70"
        onClick={() => window.history.back()}
        type="button"
      >
        ×
      </button>
      <form
        className="w-full max-w-xl mx-auto bg-white p-0 rounded-lg flex flex-col items-center"
        onSubmit={handleSubmit}
        style={{ minWidth: 400, marginTop: -100 }}
      >
        {/* Título */}
        <h2 className="text-5xl font-bold text-center mt-8 mb-4 text-black">
          Registro
        </h2>
        <p className="text-center mb-4 text-1xl -mt-2 text-black">
          crea tu cuenta ya
        </p>

        {/* Inputs doble columna */}
        <div className="flex w-full gap-4 mb-4">
          <input
            className="flex-1 border border-black rounded-xl p-3 text-lg placeholder-gray-400 text-black"
            placeholder="Nombres"
            name="nombres"
            value={form.nombres}
            onChange={handleChange}
            required
          />
          <input
            className="flex-1 border border-black rounded-xl p-3 text-lg placeholder-gray-400 text-black"
            placeholder="Apellidos"
            name="apellidos"
            value={form.apellidos}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex w-full gap-4 mb-4">
          <input
            className="flex-1 border border-black rounded-xl p-3 text-lg placeholder-gray-400 text-black"
            placeholder="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <select
            className="flex-1 border border-black rounded-xl p-3 text-lg bg-white text-gray-400"
            name="edad"
            value={form.edad}
            onChange={handleChange}
            required
          >
            <option value="">Edad</option>
            {[
              { label: "18-22", value: "18-22" },
              { label: "22-24", value: "22-24" },
              { label: "24-26", value: "24-26" },
              { label: "26-32", value: "26-32" },
              { label: "+32", value: "+32" },
            ].map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
        {/* Contraseña */}
        <input
          className="w-full border border-black rounded-xl p-3 text-lg mb-4 placeholder-gray-400 text-black"
          placeholder="Contraseña"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <input
          className="w-full border border-black rounded-xl p-3 text-lg mb-4 placeholder-gray-400 text-black"
          placeholder="Confirmar contraseña"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />
        {/* Rol */}
        <select
          name="rol"
          value={form.rol}
          onChange={handleChange}
          className="w-full border border-black rounded-xl p-3 text-lg mb-4 bg-white text-gray-400"
        >
          <option value="cliente">Cliente</option>
          <option value="admin">Admin</option>
        </select>
        {/* Checkbox */}
        <div className="w-full flex items-center mb-2">
          <input
            type="checkbox"
            name="acceptTerms"
            checked={form.acceptTerms}
            onChange={handleChange}
            className="mr-2"
            id="terms"
            required
          />
          <label htmlFor="terms" className="text-sm select-none text-black">
            He leído y acepto los{" "}
            <a
              href="#"
              className="underline"
              onClick={(e) => {
                e.preventDefault();
                setShowTerms(true);
              }}
            >
              Términos y Políticas de Privacidad
            </a>
          </label>
        </div>
        {/* Error/success */}
        {error && (
          <div className="text-red-600 mb-2 text-sm w-full text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="text-green-600 mb-2 text-sm w-full text-center">
            {success}
          </div>
        )}
        {/* Botón crear cuenta */}
        <button
          type="submit"
          className="w-full py-3 bg-black text-white rounded-xl font-medium mb-4 shadow-lg text-lg hover:bg-black/90 transition-shadow"
          style={{
            boxShadow: "4px 8px 12px 0 rgba(0,0,0,0.18)",
          }}
        >
          CREAR CUENTA
        </button>
        {/* Link ya tienes cuenta */}
        <div className="text-center text-base mb-2 text-black">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="underline">
            Iniciar Sesión
          </Link>
        </div>
      </form>
      {showTerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
            <button
              className="absolute top-2 right-4 text-2xl font-bold text-gray-500 hover:text-black"
              onClick={() => setShowTerms(false)}
              aria-label="Cerrar"
            >
              ×
            </button>
            <h2 className="text-xl text-black font-bold mb-2">
              TÉRMINOS Y CONDICIONES DE USO
            </h2>
            <div className="text-sm text-black max-h-[60vh] overflow-y-auto whitespace-pre-line">
              Última actualización: 09/06/2025
              {"\n"}Bienvenido(a) a Tussy Store (“la Plataforma”), operada por
              Tussy Store (“nosotros”).{"\n"}Al usar esta Plataforma, usted
              acepta los siguientes términos y condiciones. Si no está de
              acuerdo con alguno, debe abstenerse de utilizar nuestros
              servicios.
              {"\n"}________________________________________
              {"\n"}1. Objeto
              {"\n"}La Plataforma proporciona una experiencia de compra de
              prendas a través de una plataforma web
              {"\n"}________________________________________
              {"\n"}2. Registro de Usuario
              {"\n"}El acceso a ciertas funciones requiere la creación de una
              cuenta personal. Usted es responsable de mantener la
              confidencialidad de sus credenciales.
              {"\n"}________________________________________
              {"\n"}3. Propiedad Intelectual
              {"\n"}Todo el contenido, software, interfaces y funcionalidades
              son propiedad de Tussy Store y están protegidos por derechos de
              autor, marcas registradas y otras leyes.
              {"\n"}No se permite copiar, modificar, distribuir o hacer
              ingeniería inversa del software sin autorización expresa.
              {"\n"}________________________________________
              {"\n"}4. Uso Permitido
              {"\n"}Usted se compromete a:
              {"\n"}• Usar la Plataforma de forma lícita.
              {"\n"}• No interferir con la seguridad o funcionalidad del
              servicio.
              {"\n"}• No introducir malware o contenido dañino.
              {"\n"}________________________________________
              {"\n"}5. Responsabilidad
              {"\n"}La Plataforma se ofrece “tal cual”. No garantizamos que el
              servicio esté libre de errores o interrupciones. En ningún caso
              seremos responsables por daños derivados del uso del servicio.
              {"\n"}________________________________________
              {"\n"}6. Modificaciones
              {"\n"}Nos reservamos el derecho de modificar estos términos en
              cualquier momento. Las modificaciones se notificarán en el sitio y
              entrarán en vigor desde su publicación.
              {"\n"}________________________________________
              {"\n"}7. Legislación aplicable
              {"\n"}Estos términos se rigen por las leyes de la República de
              Colombia.
              {"\n"}________________________________________
              {"\n"}8. Contacto
              {"\n"}Si tiene preguntas, escríbanos a:
              soportetussystore@gmail.com.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
