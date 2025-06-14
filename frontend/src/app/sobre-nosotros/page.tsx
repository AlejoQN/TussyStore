"use client";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

const misionImg = "/img/tussy-sale.jpg";
const visionImg = "/img/tussy-shop.jpg";
const valoresImg = "/img/urban-tussy.jpg";

export default function SobreNosotros() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[320px] md:h-[340px] flex items-center justify-center bg-black/80">
        <img
          src="/img/Banner.png"
          alt="Tienda Tussy"
          className="absolute inset-0 w-full h-full object-cover opacity-20 z-0"
        />
        <div className="relative z-10 text-center max-w-3xl mx-auto px-4">
          <h1 className="text-white text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
            Sobre Nosotros
          </h1>
          <p className="text-white text-lg md:text-xl rounded px-4 py-2 inline-block">
            En <span className="text-pink-600 font-semibold">Tussy Store</span>,
            creemos que la moda es una forma de expresión que va más allá de la
            ropa. Nuestro objetivo es ofrecer prendas urbanas que reflejen
            autenticidad, estilo y personalidad. Nos apasiona el <b>diseño</b>,
            la <b>creatividad</b> y la <b>comodidad</b>, por lo que cada una de
            nuestras piezas está pensada para personas que quieren destacar sin
            perder su esencia.
          </p>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="max-w-5xl mx-auto w-full py-16 px-4">
        <div className="flex flex-col md:flex-row items-center mb-16 gap-8 md:gap-0">
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-black">
              Misión
            </h2>
            <p className="text-gray-800 text-lg mb-4">
              Nuestra misión es brindarte una experiencia de compra única, con
              productos de calidad y diseños que se adapten a tu estilo de vida.
              Queremos que cada prenda que elijas te haga sentir seguro,
              auténtico y cómodo.
            </p>
            <p className="text-gray-800 text-lg">
              En Tussy Store, no solo vendemos ropa, creamos un movimiento donde
              la individualidad y la moda se fusionan para que puedas expresarte
              libremente.
            </p>
          </div>
          <div className="flex-1 flex justify-center items-center">
            {/* Imagen estilizada */}
            <div className="relative w-[230px] h-[230px] md:w-[270px] md:h-[270px]">
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 270 270"
              >
                <ellipse cx="135" cy="135" rx="135" ry="120" fill="black" />
                <path
                  d="M15,45 C60,120 200,20 250,210"
                  stroke="#fff"
                  strokeWidth="3"
                  fill="none"
                />
                {/* Puedes agregar más detalles SVG si deseas */}
              </svg>
              <img
                src={misionImg}
                alt="Misión"
                className="absolute left-8 top-8 w-[175px] h-[175px] md:w-[200px] md:h-[200px] object-cover rounded-[18px] shadow-lg rotate-6 border-4 border-white"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row-reverse items-center mb-16 gap-8 md:gap-0">
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-black">
              Visión
            </h2>
            <p className="text-gray-800 text-lg">
              Aspiramos a convertirnos en una marca de referencia en la moda
              urbana, reconocida por nuestros diseños exclusivos, la calidad de
              nuestros productos y la conexión con nuestra comunidad. Queremos
              trascender las tendencias pasajeras y consolidarnos como una
              tienda en la que puedas confiar para encontrar piezas que
              realmente representen tu estilo.
            </p>
          </div>
          <div className="flex-1 flex justify-center items-center">
            {/* Imagen estilizada */}
            <div className="relative w-[230px] h-[230px] md:w-[270px] md:h-[270px]">
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 270 270"
              >
                <ellipse cx="135" cy="135" rx="135" ry="120" fill="black" />
                <path
                  d="M15,45 C60,120 200,20 250,210"
                  stroke="#fff"
                  strokeWidth="3"
                  fill="none"
                />
              </svg>
              <img
                src={visionImg}
                alt="Visión"
                className="absolute left-8 top-8 w-[175px] h-[175px] md:w-[200px] md:h-[200px] object-cover rounded-[18px] shadow-lg -rotate-6 border-4 border-white"
              />
            </div>
          </div>
        </div>

        {/* Nuestros valores */}
        <div className="flex flex-col md:flex-row items-center mb-16 gap-8 md:gap-0">
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-black">
              Nuestros Valores
            </h2>
            <ul className="text-gray-800 text-lg space-y-2">
              <li>
                <span className="mr-1" role="img" aria-label="check"></span>
                <b>Autenticidad</b> – Creemos en la importancia de ser fiel a
                uno mismo y reflejarlo en cada outfit.
              </li>
              <li>
                <span className="mr-1" role="img" aria-label="check"></span>
                <b>Calidad</b> – Seleccionamos cuidadosamente los materiales
                para ofrecerte prendas cómodas, duraderas y bien confeccionadas.
              </li>
              <li>
                <span className="mr-1" role="img" aria-label="check"></span>
                <b>Compromiso</b> – Nos esforzamos en brindarte un servicio
                confiable, con envíos rápidos y atención personalizada.
              </li>
              <li>
                <span className="mr-1" role="img" aria-label="check"></span>
                <b>Sostenibilidad</b> – Apostamos por prácticas responsables con
                el medio ambiente y una moda más consciente.
              </li>
            </ul>
          </div>
          <div className="flex-1 flex justify-center items-center">
            {/* Imagen estilizada */}
            <div className="relative w-[230px] h-[230px] md:w-[270px] md:h-[270px]">
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 270 270"
              >
                <ellipse cx="135" cy="135" rx="135" ry="120" fill="black" />
                <path
                  d="M15,45 C60,120 200,20 250,210"
                  stroke="#fff"
                  strokeWidth="3"
                  fill="none"
                />
              </svg>
              <img
                src={valoresImg}
                alt="Valores"
                className="absolute left-8 top-8 w-[175px] h-[175px] md:w-[200px] md:h-[200px] object-cover rounded-[18px] shadow-lg rotate-3 border-4 border-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Comunidad */}
      <section className="py-12 bg-white text-center px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-black">
          Únete a nuestra comunidad
        </h2>
        <p className="text-gray-700 text-lg max-w-2xl mx-auto mb-6">
          Queremos que formes parte de nuestra familia. Síguenos en redes
          sociales para descubrir nuestras últimas colecciones, promociones y
          noticias. Comparte tu estilo con nosotros usando el hashtag{" "}
          <span className="font-semibold">#TussyStyle</span> y muéstranos cómo
          combinas nuestras prendas.
        </p>
        <div className="flex flex-col items-center">
          <span className="mb-2 text-lg font-semibold text-black">
            Síguenos en:
          </span>

          <div className="flex gap-8 items-center justify-center">
            <a
              href="https://www.instagram.com/tussy.store/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center group"
            >
              <img
                src="/img/Instagram-Logo.png"
                alt="Instagram"
                className="w-9 h-9 mb-1 group-hover:scale-110 transition"
              />
              <span className="text-sm text-black group-hover:text-pink-600">
                Tussy_Store
              </span>
            </a>

            <a
              href="https://www.tiktok.com/@tussystore"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center group"
            >
              <img
                src="/img/Tiktok-Logo.png"
                alt="TikTok"
                className="w-9 h-9 mb-1 group-hover:scale-110 transition"
              />
              <span className="text-sm text-black group-hover:text-pink-600">
                Tussy_Store
              </span>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}