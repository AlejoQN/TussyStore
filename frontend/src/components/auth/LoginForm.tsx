"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [remember, setRemember] = useState(false);
  const [show, setShow] = useState(false);
  const [error, setError] = useState<{ type: string; msg: string } | null>(
    null
  );
  const [success, setSuccess] = useState<{ type: string; msg: string } | null>(
    null
  );

  useEffect(() => {
    const savedEmail = localStorage.getItem("tussy_remember_email");
    const savedPassword = localStorage.getItem("tussy_remember_password");
    if (savedEmail && savedPassword) {
      setForm({ email: savedEmail, password: savedPassword });
      setRemember(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await login(form.email, form.password); // Esto debe guardar token y user en contexto y localStorage
      setSuccess({ type: "login", msg: "¡Inicio de sesión exitoso!" });
      setTimeout(() => router.push("/"), 1200);
    } catch (err: any) {
      // Si el backend responde con un mensaje específico, úsalo
      if (err.response?.data?.error === "Credenciales inválidas") {
        setError({
          type: "credentials",
          msg: "El email o la contraseña son incorrectos.",
        });
      } else if (err.response?.data?.error) {
        setError({
          type: "server",
          msg: err.response.data.error,
        });
      } else {
        setError({
          type: "server",
          msg: "Ocurrió un error inesperado. Intenta de nuevo.",
        });
      }
    }

    if (remember) {
      localStorage.setItem("tussy_remember_email", form.email);
      localStorage.setItem("tussy_remember_password", form.password);
    } else {
      localStorage.removeItem("tussy_remember_email");
      localStorage.removeItem("tussy_remember_password");
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
          value={form.email}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, email: e.target.value }))
          }
          required
        />
        {/* Contraseña + icono */}
        <div className="relative w-full mb-4">
          <input
            className="w-full border border-black rounded-xl p-3 text-lg placeholder-gray-400 pr-12 text-black"
            placeholder="Contraseña"
            type={show ? "text" : "password"}
            value={form.password}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, password: e.target.value }))
            }
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
          <div className="text-red-600 mb-2 text-sm w-full text-center font-semibold">
            {error.msg}
          </div>
        )}
        {/* Success */}
        {success && (
          <div className="text-green-600 mb-2 text-sm w-full text-center font-semibold">
            {success.msg}
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
        {/* ...resto del formulario... */}
      </form>
    </div>
  );
}
