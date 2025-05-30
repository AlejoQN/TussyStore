"use client";
import Link from "next/link";

export default function OrdenConfirmadaPage() {
  return (
    <div className="max-w-lg mx-auto py-16 text-center">
      <h1 className="text-3xl font-bold mb-4 text-primary">
        ¡Pedido confirmado!
      </h1>
      <p className="mb-6">
        Gracias por tu compra. Tu pedido ha sido registrado exitosamente.
      </p>
      <Link
        href="/perfil/ordenes"
        className="bg-primary text-white px-6 py-2 rounded font-semibold mr-2"
      >
        Ver mi pedido
      </Link>
      <Link
        href="/"
        className="bg-gray-200 text-black px-6 py-2 rounded font-semibold ml-2"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
