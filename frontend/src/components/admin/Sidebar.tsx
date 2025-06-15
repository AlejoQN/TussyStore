"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const menu = [
  {
    label: "General",
    icon: "/img/iconos/general.svg",
    href: "/admin/overview",
  },
  {
    label: "Analíticas",
    icon: "/img/iconos/analiticas.svg",
    href: "/admin/analytics",
  },
];

const gestion = [
  {
    label: "Productos",
    icon: "/img/iconos/productos.svg",
    href: "/admin/products",
  },
  { label: "Usuarios", icon: "/img/iconos/usuarios.svg", href: "/admin/users" },
  { label: "Órdenes", icon: "/img/iconos/ordenes.svg", href: "/admin/orders" },
];

export default function AdminSidebar({ active }: { active: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Botón hamburguesa solo en móvil */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white border rounded-full p-2 shadow"
        onClick={() => setOpen(true)}
        aria-label="Abrir menú"
        type="button"
      >
        <svg
          className="h-7 w-7"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      {/* Sidebar drawer para móvil */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-200 ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        } md:hidden`}
        onClick={() => setOpen(false)}
      />
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white border-r flex flex-col justify-between
          transition-transform duration-200
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:static md:translate-x-0 md:flex
        `}
        style={{ minHeight: "100vh" }}
      >
        <div>
          <div className="p-6">
            <Link href="/">
              <img
                src="/img/Logo-2.png"
                alt="Logo"
                className="h-14 mx-auto cursor-pointer"
              />
            </Link>
            {/* Botón cerrar solo en móvil */}
            <button
              className="md:hidden absolute top-4 right-4 text-3xl text-black"
              onClick={() => setOpen(false)}
              aria-label="Cerrar menú"
              type="button"
            >
              ×
            </button>
          </div>
          <nav className="px-4">
            <div className="mb-4">
              <div className="text-xs text-gray-400 mb-2">Menú</div>
              {menu.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded font-medium mb-1 ${
                    active === item.label.toLowerCase()
                      ? "bg-primary text-white"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  <img src={item.icon} alt={item.label} className="h-5 w-5" />
                  {item.label}
                </Link>
              ))}
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-2">Gestión</div>
              {gestion.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded font-medium mb-1 ${
                    active === item.label.toLowerCase()
                      ? "bg-primary text-white"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  <img src={item.icon} alt={item.label} className="h-5 w-5" />
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
        <div className="p-4">
          <button className="flex items-center gap-2 text-red-500 hover:underline">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                d="M17 16l4-4m0 0l-4-4m4 4H7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
}
