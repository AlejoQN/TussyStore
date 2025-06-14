"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import axios from "axios";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

export default function EliminarCuentaPage() {
  const { token, logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      await axios.delete("/api/usuario/eliminar", {
        headers: { Authorization: `Bearer ${token}` },
      });
      logout();
      router.push("/");
    } catch (err) {
      alert("Error eliminando la cuenta");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/perfil");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 shadow-lg text-center max-w-md w-full">
            <div className="text-xl text-black font-bold mb-4">Eliminar cuenta</div>
            <div className="mb-6 text-gray-700">
              ¿Estás seguro de eliminar tu cuenta?
            </div>
            <button
              className="w-full py-2 rounded bg-red-100 text-red-600 font-semibold hover:bg-red-200 mb-2"
              onClick={handleDeleteAccount}
              disabled={loading}
            >
              {loading ? "Eliminando..." : "Eliminar"}
            </button>
            <button
              className="w-full py-2 rounded bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
