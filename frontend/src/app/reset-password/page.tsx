"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!password || !confirm) {
      setError("Debes ingresar y confirmar la nueva contraseña.");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "No se pudo actualizar la contraseña.");
      }
      setSuccess("Contraseña actualizada correctamente.");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setError(err.message || "Error al actualizar la contraseña.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-black bg-white">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow max-w-md w-full"
      >
        <h1 className="text-2xl font-bold mb-4">Restablecer contraseña</h1>
        <input
          type="password"
          placeholder="Nueva contraseña"
          className="w-full border rounded px-3 py-2 mb-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirmar contraseña"
          className="w-full border rounded px-3 py-2 mb-4"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        <button
          type="submit"
          className="bg-black text-white px-6 py-2 rounded font-semibold w-full"
        >
          Cambiar contraseña
        </button>
      </form>
    </div>
  );
}
