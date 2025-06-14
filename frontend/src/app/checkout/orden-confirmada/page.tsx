"use client";
import Link from "next/link";

export default function OrdenConfirmadaPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="max-w-lg w-full text-center py-16 rounded-xl shadow bg-white border">
        <img
          src="/img/iconos/chulo.svg"
          alt="Pedido confirmado"
          className="mx-auto mb-6 w-20 h-20"
        />
        <h1 className="text-3xl font-bold mb-4 text-primary">
          ¡Pedido confirmado!
        </h1>
        <p className="mb-6 text-gray-700">
          Gracias por tu compra. Tu pedido ha sido registrado exitosamente.
          <br />
          Pronto recibirás un correo con los detalles y el estado de tu pedido.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/perfil/ordenes"
            className="bg-primary text-white px-6 py-2 rounded font-semibold"
          >
            Ver mis órdenes
          </Link>
          <Link
            href="/"
            className="bg-gray-200 text-black px-6 py-2 rounded font-semibold"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
