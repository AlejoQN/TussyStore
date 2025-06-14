"use client";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

const categorias = ["Hombre", "Mujer", "Niños", "Accesorios"];

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showCategorias, setShowCategorias] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cierra el menú si se hace click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  // Autocomplete en búsqueda
  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (value.trim().length === 0) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    // Debounce para evitar muchas peticiones
    timeoutRef.current = setTimeout(async () => {
      try {
        // Cambia la ruta según tu API real
        const res = await fetch(
          `/api/productos?busqueda=${encodeURIComponent(value)}`
        );
        const data = await res.json();
        setSuggestions(data.items?.slice(0, 5) || []);
        setShowDropdown(true);
      } catch {
        setSuggestions([]);
        setShowDropdown(false);
      }
    }, 250);
  };

  // Submit búsqueda
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/catalogo?busqueda=${encodeURIComponent(search.trim())}`);
      setMenuOpen(false);
      setShowDropdown(false);
      setSuggestions([]);
      setSearch("");
    }
  };

  // Ir al producto desde sugerencia
  const handleSuggestionClick = (productoId: number) => {
    router.push(`/producto/${productoId}`);
    setShowDropdown(false);
    setSuggestions([]);
    setSearch("");
  };

  // Ir al carrito
  const handleCart = () => {
    router.push("/cart");
    setMenuOpen(false);
  };

  // Ir a favoritos
  const handleFavoritos = () => {
    router.push("/favoritos");
    setMenuOpen(false);
  };

  return (
    <header className="w-full bg-white shadow px-4 md:px-8 py-3 flex items-center justify-between z-50 relative">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <img src="/img/Logo-2.png" alt="Tussy Store" className="h-8 md:h-10" />
      </Link>
      {/* Hamburguesa móvil */}
      <button
        className="md:hidden text-2xl ml-auto"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="Abrir menú"
      >
        ☰
      </button>
      {/* Navegación */}
      <nav
        className={`fixed md:static top-0 left-0 w-3/4 max-w-xs h-full bg-white shadow-lg md:bg-transparent md:shadow-none z-50 transition-transform duration-200
        ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 flex flex-col md:flex-row md:items-center gap-8 md:gap-8 text-black p-8 md:p-0`}
      >
        <button
          className="md:hidden text-2xl mb-8 self-end"
          onClick={() => setMenuOpen(false)}
          aria-label="Cerrar menú"
        >
          ×
        </button>
        <Link
          href="/"
          className="hover:text-primary font-medium"
          onClick={() => setMenuOpen(false)}
        >
          Home
        </Link>
        <div
          className="relative"
          onMouseEnter={() => setShowCategorias(true)}
          onMouseLeave={() => setShowCategorias(false)}
        >
          <Link
            href="/catalogo"
            className="hover:text-primary font-medium"
            onClick={() => setMenuOpen(false)}
          >
            Catálogo
          </Link>
          {/* Categorías en menú móvil */}
          {menuOpen && (
            <div className="block md:hidden mt-2">
              {categorias.map((cat) => (
                <Link
                  key={cat}
                  href={`/catalogo?categoria=${encodeURIComponent(cat)}`}
                  className="block px-4 py-2 hover:bg-primary/10"
                  onClick={() => setMenuOpen(false)}
                >
                  {cat}
                </Link>
              ))}
            </div>
          )}
        </div>
        <Link
          href="/sobre-nosotros"
          className="hover:text-primary font-medium"
          onClick={() => setMenuOpen(false)}
        >
          Sobre Nosotros
        </Link>
      </nav>
      {/* Acciones */}
      <div className="hidden md:flex items-center gap-4 relative">
        {/* Búsqueda */}
        <form onSubmit={handleSearch} className="flex items-center relative">
          <input
            type="text"
            placeholder="Buscar productos..."
            className="border rounded-l px-2 py-1 text-sm"
            value={search}
            onChange={handleSearchChange}
            onFocus={() => search && setShowDropdown(true)}
            autoComplete="off"
          />
          <button
            type="submit"
            className="bg-primary px-2 py-1 rounded-r text-white"
            title="Buscar"
            aria-label="Buscar"
          >
            <img
              src="/img/iconos/busqueda.svg"
              alt="Buscar"
              className="h-5 w-5"
            />
          </button>
          {/* Dropdown de sugerencias */}
          {showDropdown && suggestions.length > 0 && (
            <div className="absolute left-0 top-full mt-1 w-full bg-white border rounded shadow z-50 max-h-64 overflow-y-auto">
              {suggestions.map((prod) => (
                <div
                  key={prod.id}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-primary/10 cursor-pointer"
                  onClick={() => handleSuggestionClick(prod.id)}
                >
                  <img
                    src={
                      prod.imagen?.startsWith("http")
                        ? prod.imagen
                        : prod.imagen
                        ? `/uploads/${prod.imagen.replace(/^\/?uploads\//, "")}`
                        : "/img/no-image.png"
                    }
                    alt={prod.nombre}
                    className="w-10 h-10 object-contain rounded"
                  />
                  <span className="truncate">{prod.nombre}</span>
                </div>
              ))}
            </div>
          )}
        </form>
        {/* Favoritos */}
        <button
          className="hover:text-primary"
          title="Favoritos"
          onClick={() => {
            router.push("/perfil/favoritos");
            setMenuOpen(false);
          }}
          aria-label="Favoritos"
        >
          <img
            src="/img/iconos/favorito.svg"
            alt="Favoritos"
            className="h-7 w-7"
          />
        </button>
        {/* Carrito */}
        <Link href="/cart" className="relative">
          <img
            src="/img/iconos/carrito.svg"
            alt="Carrito"
            className="h-7 w-7 hover:text-primary"
            title="Carrito"
            onClick={handleCart}
            aria-label="Carrito"
          />
        </Link>
        {user ? (
          <div className="relative" ref={menuRef}>
            <button
              className="focus:outline-none"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Abrir menú de usuario"
            >
              <img
                src={
                  user?.foto
                    ? user.foto.startsWith("http")
                      ? user.foto
                      : `/uploads/${user.foto.replace(/^\/?uploads\//, "")}`
                    : "/img/perfil-demo.jpg"
                }
                alt="Perfil"
                className="h-8 w-8 rounded-full object-cover border"
              />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50 py-2">
                <div className="px-4 py-2 font-semibold text-black border-b">
                  {user.nombre}
                </div>
                {/* SOLO PARA ADMIN */}
                {user.rol === "admin" && (
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      setMenuOpen(false);
                      router.push("/admin/overview");
                    }}
                  >
                    Dashboard
                  </button>
                )}
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    setMenuOpen(false);
                    router.push("/perfil");
                  }}
                >
                  Mi perfil
                </button>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="ml-2 px-4 py-1 border rounded hover:bg-pink-400 transition text-black"
          >
            Iniciar sesión
          </Link>
        )}
      </div>
    </header>
  );
}
