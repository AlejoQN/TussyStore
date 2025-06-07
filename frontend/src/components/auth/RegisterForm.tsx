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
};

export default function RegisterForm() {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
      <Link href="/" className="absolute top-8 left-8 w-24" style={{ width: 90 }}>
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
            <a href="#" className="underline">
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
        {/* Separador */}
        <div className="flex items-center w-full my-2">
          <hr className="flex-1 border-gray-300" />
          <span className="px-2 text-sm text-gray-400">O Regístrate con</span>
          <hr className="flex-1 border-gray-300" />
        </div>
        {/* Botón Google */}
        <a
          href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google`}
          className="w-1/2 flex items-center justify-center border border-gray-300 rounded-xl h-12 mt-3 mb-0 bg-white shadow-sm hover:shadow-md transition text-black font-semibold"
        >
          <svg className="w-7 h-7 mr-2" viewBox="0 0 48 48">
            <g>
              <path
                fill="#4285F4"
                d="M24 9.5c3.54 0 6.7 1.22 9.2 3.22l6.86-6.86C36.44 2.16 30.6 0 24 0 14.82 0 6.72 5.06 2.69 12.44l7.98 6.2C12.14 13.06 17.61 9.5 24 9.5z"
              />
              <path
                fill="#34A853"
                d="M46.1 24.55c0-1.64-.15-3.22-.43-4.74H24v9.01h12.42c-.54 2.9-2.16 5.36-4.62 7.03l7.1 5.52C43.98 37.12 46.1 31.36 46.1 24.55z"
              />
              <path
                fill="#FBBC05"
                d="M10.67 28.65c-1.1-3.22-1.1-6.7 0-9.92l-7.98-6.2C.86 16.94 0 20.36 0 24c0 3.64.86 7.06 2.69 10.47l7.98-6.2z"
              />
              <path
                fill="#EA4335"
                d="M24 48c6.6 0 12.14-2.18 16.19-5.94l-7.1-5.52c-2.01 1.36-4.6 2.16-7.09 2.16-6.39 0-11.86-3.56-14.33-8.74l-7.98 6.2C6.72 42.94 14.82 48 24 48z"
              />
              <path fill="none" d="M0 0h48v48H0z" />
            </g>
          </svg>
          Google
        </a>
      </form>
    </div>
  );
}
