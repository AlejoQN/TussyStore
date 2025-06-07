"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error en el login");
      // Aquí podrías guardar el token y redireccionar
      // localStorage.setItem("token", data.token);
      // router.push("/");
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
        className="absolute top-8 right-8 text-black text-4xl font-light hover:opacity-70 z-50"
        onClick={() => (window.location.href = "/")}
        type="button"
      >
        ×
      </button>
      {/* Título tienda */}
      <div className="absolute left-0 right-0 top-8 flex justify-center">
        <span
          className="text-black text-5xl font-thin"
          style={{ fontFamily: "TussyFont, sans-serif" }}
        >
          Tussy Store
        </span>
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow max-w-md w-full"
      >
        {/* Título */}
        <h2 className="text-4xl font-bold text-black text-left w-full mb-6 mt-6">
          Inicio de sesión
        </h2>
        {/* Email */}
        <input
          className="w-full border border-black rounded-xl p-3 text-lg mb-4 placeholder-gray-400 text-black"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {/* Contraseña + icono */}
        <div className="relative w-full mb-4">
          <input
            className="w-full border border-black rounded-xl p-3 text-lg placeholder-gray-400 pr-12 text-black"
            placeholder="Contraseña"
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-black"
            aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
            tabIndex={-1}
            onClick={() => setShow(!show)}
          >
            {/* Ícono de ojo (SVG) */}
            {show ? (
              // Ojo abierto
              <svg
                width="26"
                height="26"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            ) : (
              // Ojo tachado
              <svg
                width="26"
                height="26"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-7 0-11-7-11-7a17.61 17.61 0 0 1 5.06-5.94M1 1l22 22M9.5 9.5A3 3 0 0 0 12 15a3 3 0 0 0 3-3M4.22 4.22A10.07 10.07 0 0 1 12 5c7 0 11 7 11 7a17.61 17.61 0 0 1-5.06 5.94" />
              </svg>
            )}
          </button>
        </div>
        {/* Checkbox y recuperar contraseña */}
        <div className="flex w-full items-center justify-between mb-2">
          <label className="flex items-center text-black text-base">
            <input
              type="checkbox"
              className="mr-2"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            Recordar contraseña
          </label>
          <Link href="/recover" className="text-black text-base underline">
            Recuperar contraseña
          </Link>
        </div>
        {/* Error */}
        {error && (
          <div className="text-red-600 mb-2 text-sm w-full text-center">
            {error}
          </div>
        )}
        {/* Botón iniciar sesión */}
        <button
          type="submit"
          className="w-full py-3 bg-white text-black rounded-xl font-medium mb-4 shadow-lg border border-black text-lg hover:bg-gray-50 transition-shadow"
          style={{
            boxShadow: "4px 8px 12px 0 rgba(0,0,0,0.18)",
          }}
        >
          Iniciar Sesión
        </button>
        {/* Link registrarse */}
        <div className="text-center text-base mb-2 text-black">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="underline text-black">
            Registrarse
          </Link>
        </div>
        {/* Separador */}
        <div className="flex items-center w-full my-2">
          <hr className="flex-1 border-gray-300" />
          <span className="px-2 text-sm text-gray-400">O inicia con</span>
          <hr className="flex-1 border-gray-300" />
        </div>
        {/* Botón Google */}
        <a
          href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google`}
          className="w-full flex items-center justify-center border border-gray-300 rounded-xl h-12 mt-3 mb-0 bg-white shadow-sm hover:shadow-md transition text-black font-semibold"
        >
          <svg className="w-6 h-6 mr-2" viewBox="0 0 48 48">
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
        {/* ...resto del formulario... */}
      </form>
    </div>
  );
}
