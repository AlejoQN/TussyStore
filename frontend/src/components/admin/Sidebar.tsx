"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
  return (
    <aside className="w-64 min-h-screen bg-white border-r flex flex-col justify-between">
      <div>
        <div className="p-6">
          <Link href="/">
            <img
              src="/img/Logo-2.png"
              alt="Logo"
              className="h-14 mx-auto cursor-pointer"
            />
          </Link>
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
  );
}
