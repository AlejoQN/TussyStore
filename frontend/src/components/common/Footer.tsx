import Link from "next/link";
import { useState } from "react";

const terminosTexto = `
Última actualización: 09/06/2025

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
`;

export default function Footer() {
  const [showTerms, setShowTerms] = useState(false);

  return (
    <footer className="bg-[#181818] text-white py-10 px-4 md:px-6 mt-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
        {/* Logo y contacto */}
        <div>
          <img
            src="/img/Logo-2.png"
            alt="Tussy Store"
            className="h-14 md:h-16 mb-4"
          />
          <p className="text-base mb-3">Tienda online de ropa y accesorios.</p>
          <div className="flex gap-3 mt-3">
            <a
              href="https://www.instagram.com/tussy.store/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/img/Instagram-Logo.png"
                alt="Instagram"
                className="h-8"
              />
            </a>
            <a
              href="https://tiktok.com/@tussystore"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/img/Tiktok-Logo.png" alt="TikTok" className="h-10" />
            </a>
            <a
              href="https://wa.me/573001234567"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/img/whatsapp-Logo.png"
                alt="WhatsApp"
                className="h-8"
              />
            </a>
          </div>
        </div>
        {/* Información */}
        <div>
          <h4 className="font-bold mb-3 text-lg">Información</h4>
          <ul className="text-base space-y-2">
            <li>
              <Link href="/entrega" className="hover:underline">
                Información de entrega
              </Link>
            </li>
            <li>
              <Link href="/privacidad" className="hover:underline">
                Política de privacidad
              </Link>
            </li>
            <li>
              <button
                type="button"
                className="hover:underline bg-transparent text-left w-full"
                onClick={() => setShowTerms(true)}
              >
                Términos y condiciones
              </button>
            </li>
          </ul>
        </div>
        {/* Métodos de pago */}
        <div>
          <h4 className="font-bold mb-3 text-lg">Métodos de pago</h4>
          <div className="flex gap-3 items-center flex-wrap">
            <img
              src="/img/Mercadopago.png"
              alt="MercadoPago"
              className="h-14"
            />
            <img
              src="/img/Bancolombia-Logo.png"
              alt="Bancolombia"
              className="h-14"
            />
            <img src="/img/Nequi-Logo.png" alt="Nequi" className="h-14" />
          </div>
        </div>
      </div>
      <div className="text-center text-sm mt-10 opacity-80">
        © {new Date().getFullYear()} Tussy Store. Todos los derechos reservados.
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
            <a
              href="#"
              className="text-xl text-black font-bold mb-2 underline hover:text-primary cursor-pointer block text-center"
              onClick={(e) => {
                e.preventDefault();
                setShowTerms(true);
              }}
            >
              TÉRMINOS Y CONDICIONES DE USO
            </a>
            <div className="text-sm text-black max-h-[60vh] overflow-y-auto whitespace-pre-line mt-2">
              {terminosTexto}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
