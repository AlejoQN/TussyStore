import Link from "next/link";
import { useState } from "react";

export default function Footer() {
  const [showTerms, setShowTerms] = useState(false);

  return (
    <footer className="bg-[#181818] text-white pt-8 pb-2 px-2 md:px-6 mt-16 text-sm">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-white/10 pb-6 justify-items-center">
        {/* Logo y contacto */}
        <div className="flex flex-col gap-2 items-center md:items-start">
          <img src="/img/Logo-2.png" alt="Tussy Store" className="h-14 mb-2" />
          <span className="text-xs mt-2">+57 300 4627581</span>
          <span className="text-xs">Tussysabes@gmail.com</span>
          <div className="flex gap-2 mt-4">
            <div className="bg-white rounded-lg p-2 flex items-center justify-center">
              <img
                src="/img/Bancolombia-Logo.png"
                alt="Bancolombia"
                className="h-9"
              />
            </div>
            <div className="bg-white rounded-lg p-2 flex items-center justify-center">
              <img
                src="/img/Mercadopago.png"
                alt="Mercadopago"
                className="h-10"
              />
            </div>
            <div className="bg-white rounded-lg p-2 flex items-center justify-center">
              <img src="/img/Nequi-Logo.png" alt="Nequi" className="h-9" />
            </div>
          </div>
        </div>
        {/* Información */}
        <div className="flex flex-col items-center md:items-start">
          <div className="font-bold mb-2">Información</div>
          <ul className="space-y-1">
            <li>
              <Link href="/perfil" className="hover:underline">
                Mi Cuenta
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:underline">
                Login
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:underline">
                Mi Carrito
              </Link>
            </li>
            <li>
              <Link href="/perfil/favoritos" className="hover:underline">
                Mis Favoritos
              </Link>
            </li>
          </ul>
        </div>
        {/* Servicios */}
        <div className="flex flex-col items-center md:items-start">
          <div className="font-bold mb-2">Servicios</div>
          <ul className="space-y-1">
            <li>
              <Link href="/sobre-nosotros" className="hover:underline">
                Sobre Nosotros
              </Link>
            </li>
            <li>
              <Link href="/entrega" className="hover:underline">
                Información de Entrega
              </Link>
            </li>
            <li>
              <Link href="/privacidad" className="hover:underline">
                Política de Privacidad
              </Link>
            </li>
            <li>
              <button
                type="button"
                className="hover:underline bg-transparent text-left w-full"
                onClick={() => setShowTerms(true)}
              >
                Términos & Condiciones
              </button>
            </li>
          </ul>
        </div>
      </div>
      {/* Social icons and copyright */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between mt-4 gap-2">
        <div className="text-xs opacity-80 text-center md:text-left">
          © {new Date().getFullYear()} Tussy Store. All rights reserved
        </div>
        <div className="flex gap-4 items-center text-lg">
          <a
            href="https://www.instagram.com/tussy.store/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <img
              src="/img/Instagram-Logo.png"
              alt="Instagram"
              className="h-5"
            />
          </a>
          <a
            href="https://wa.me/573004627581"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
          >
            <img src="/img/whatsapp-Logo.png" alt="WhatsApp" className="h-5" />
          </a>
          <a
            href="https://tiktok.com/@tussystore"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
          >
            <img src="/img/Tiktok-Logo.png" alt="TikTok" className="h-5" />
          </a>
        </div>
      </div>
      {/* Modal de términos y condiciones */}
      {showTerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
            <button
              className="absolute top-2 right-4 text-2xl font-bold text-gray-500 hover:text-black"
              onClick={() => setShowTerms(false)}
              aria-label="Cerrar"
            >
              ×
            </button>
            <div className="text-xl text-black font-bold mb-2 underline text-center">
              TÉRMINOS Y CONDICIONES DE USO
            </div>
            <div className="text-sm text-black max-h-[60vh] overflow-y-auto whitespace-pre-line mt-2">
              {`Última actualización: 09/06/2025

Bienvenido(a) a Tussy Store (“la Plataforma”), operada por Tussy Store (“nosotros”).
Al usar esta Plataforma, usted acepta los siguientes términos y condiciones. Si no está de acuerdo con alguno, debe abstenerse de utilizar nuestros servicios.
________________________________________
1. Objeto
La Plataforma proporciona una experiencia de compra de prendas a través de una plataforma web
________________________________________
2. Registro de Usuario
El acceso a ciertas funciones requiere la creación de una cuenta personal. Usted es responsable de mantener la confidencialidad de sus credenciales.
________________________________________
3. Propiedad Intelectual
Todo el contenido, software, interfaces y funcionalidades son propiedad de Tussy Store y están protegidos por derechos de autor, marcas registradas y otras leyes.
No se permite copiar, modificar, distribuir o hacer ingeniería inversa del software sin autorización expresa.
________________________________________
4. Uso Permitido
Usted se compromete a:
• Usar la Plataforma de forma lícita.
• No interferir con la seguridad o funcionalidad del servicio.
• No introducir malware o contenido dañino.
________________________________________
5. Responsabilidad
La Plataforma se ofrece “tal cual”. No garantizamos que el servicio esté libre de errores o interrupciones. En ningún caso seremos responsables por daños derivados del uso del servicio.
________________________________________
6. Modificaciones
Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones se notificarán en el sitio y entrarán en vigor desde su publicación.
________________________________________
7. Legislación aplicable
Estos términos se rigen por las leyes de la República de Colombia.
________________________________________
8. Contacto
Si tiene preguntas, escríbanos a: soportetussystore@gmail.com.
`}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
