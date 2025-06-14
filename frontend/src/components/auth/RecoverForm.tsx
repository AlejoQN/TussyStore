"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function RecoverForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<{ type: string; msg: string } | null>(
    null
  );
  const [success, setSuccess] = useState<{ type: string; msg: string } | null>(
    null
  );
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/auth/recuperar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error?.includes("no registrado")) {
          throw new Error("El email no está registrado.");
        }
        throw new Error(data.error || "No se pudo enviar el mail.");
      }
      setSuccess({
        type: "recover",
        msg: "¡Revisa tu correo para recuperar tu contraseña!",
      });
      setEmail("");
    } catch (err: any) {
      setError({ type: "server", msg: err.message });
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
        onClick={() => router.push("/login")}
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
        className="w-full max-w-xl bg-white p-0 rounded-lg flex flex-col items-center"
        onSubmit={handleSubmit}
        style={{ minWidth: 400, marginTop: -100 }}
      >
        <h2 className="text-3xl font-bold text-black text-center mb-2 mt-16">
          Recuperar contraseña
        </h2>
        <p className="text-center mb-8 text-lg font-semibold text-black">
          Ingresa tu email registrado para recuperar tu cuenta
        </p>

        <input
          className="w-full border border-black rounded-xl p-3 text-lg mb-8 placeholder-gray-400 text-black"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {error && (
          <div className="text-red-600 mb-2 text-sm w-full text-center font-semibold">
            {error.msg}
          </div>
        )}
        {success && (
          <div className="text-green-600 mb-2 text-sm w-full text-center font-semibold">
            {success.msg}
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3 bg-white text-black rounded-xl font-medium mb-4 shadow-lg border border-black text-lg hover:bg-gray-50 transition-shadow"
          style={{
            boxShadow: "4px 8px 12px 0 rgba(0,0,0,0.18)",
          }}
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
