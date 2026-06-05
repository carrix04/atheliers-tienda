'use client';

import { useEffect, useRef, useState } from 'react';

type Joya = {
  id: number;
  nombre: string;
  precio: string | number;
  imagen: string;
  categoria: string;
};

type GaleriaItem = {
  id: number;
  titulo: string;
  categoria: string;
  descripcion: string;
  imagen: string;
};

export default function Home() {
  const [joyas, setJoyas] = useState<Joya[]>([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(false);
  const [filtro, setFiltro] = useState('Todas');
  const [menuFijo, setMenuFijo] = useState(false);
  const [menuHeight, setMenuHeight] = useState(0);
  const [joyaSeleccionada, setJoyaSeleccionada] = useState<Joya | null>(null);
  const [bolsa, setBolsa] = useState<Joya[]>([]);
  const [bolsaAbierta, setBolsaAbierta] = useState(false);
  const [mensajeCopiado, setMensajeCopiado] = useState(false);
  const [bolsaAnimada, setBolsaAnimada] = useState(false);

  const bgWatermarkRef = useRef<HTMLImageElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const catalogoRef = useRef<HTMLElement>(null);
  const galeriaRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuPlaceholderRef = useRef<HTMLDivElement>(null);

  const categorias = ['Todas', 'Anillos', 'Pulseras', 'Collares'];

  const galeriaPreview: GaleriaItem[] = [
    {
      id: 1,
      titulo: 'Diseño artesanal',
      categoria: 'Atheliers',
      descripcion: 'Piezas pensadas para lucir con elegancia sin exceso.',
      imagen: '/galeria2.jpg',
    },
    {
      id: 2,
      titulo: 'Elegancia minimalista',
      categoria: 'Atheliers',
      descripcion: 'Formas limpias, tonos suaves y detalles delicados.',
      imagen: '/galeria3.jpg',
    },
    {
      id: 3,
      titulo: 'Detalles únicos',
      categoria: 'Atheliers',
      descripcion: 'Una mirada previa antes de explorar el catálogo completo.',
      imagen: '/galeria1.jpg',
    },
  ];

  useEffect(() => {
    const cargarJoyas = async () => {
      try {
        const res = await fetch('https://atheliers-backend.onrender.com/api/joyas/', {
          cache: 'no-store',
        });

        if (!res.ok) {
          throw new Error('No se pudo conectar con la API');
        }

        const data = await res.json();

        if (Array.isArray(data)) {
          setJoyas(data);
        } else if (Array.isArray(data.results)) {
          setJoyas(data.results);
        } else {
          setJoyas([]);
        }

        setErrorCarga(false);
      } catch (error) {
        console.error('Error cargando joyas:', error);
        setErrorCarga(true);
        setJoyas([]);
      } finally {
        setCargando(false);
      }
    };

    cargarJoyas();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scroll = window.scrollY;

      if (bgWatermarkRef.current) {
        bgWatermarkRef.current.style.transform = `translate(-50%, calc(-50% + ${
          scroll * 0.08
        }px))`;
      }

      if (heroRef.current) {
        const opacity = Math.max(0, 1 - scroll / 620);
        heroRef.current.style.transform = `translateY(${scroll * 0.12}px)`;
        heroRef.current.style.opacity = opacity.toString();
      }

      if (menuPlaceholderRef.current && menuRef.current) {
        const topOffset = window.innerWidth <= 768 ? 10 : 18;
        const menuInicio =
          menuPlaceholderRef.current.getBoundingClientRect().top + window.scrollY;
        const alturaMenu = menuRef.current.offsetHeight;

        setMenuHeight((actual) => (actual === alturaMenu ? actual : alturaMenu));

        const debeFijarse = window.scrollY + topOffset >= menuInicio;

        setMenuFijo((actual) => (actual === debeFijarse ? actual : debeFijarse));
      }
    };

    const handleResize = () => {
      if (menuRef.current) {
        setMenuHeight(menuRef.current.offsetHeight);
      }

      handleScroll();
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const elementos = Array.from(
      document.querySelectorAll('.revealItem, .revealCard')
    ) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const elemento = entry.target as HTMLElement;

          if (entry.isIntersecting) {
            elemento.classList.add('visible');
          } else {
            elemento.classList.remove('visible');
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -45px 0px',
      }
    );

    elementos.forEach((elemento) => observer.observe(elemento));

    return () => observer.disconnect();
  }, [joyas, cargando, filtro]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setJoyaSeleccionada(null);
        setBolsaAbierta(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const normalizarTexto = (texto: string | null | undefined) =>
    String(texto ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();

  const optimizarImagen = (url: string, ancho = 900) => {
    if (!url) return '';

    if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
      return url.replace('/upload/', `/upload/f_auto,q_auto,w_${ancho}/`);
    }

    return url;
  };

  const mostrarPrecio = (precio: string | number) => {
    const texto = String(precio).trim();
    return texto.startsWith('$') ? texto : `$${texto}`;
  };

  const precioNumero = (precio: string | number) => {
    const limpio = String(precio).replace(/[^\d.]/g, '');
    const numero = Number(limpio);
    return Number.isFinite(numero) ? numero : 0;
  };

  const totalBolsa = bolsa.reduce((total, joya) => total + precioNumero(joya.precio), 0);

  const joyasFiltradas =
    filtro === 'Todas'
      ? joyas
      : joyas.filter(
          (joya) => normalizarTexto(joya.categoria) === normalizarTexto(filtro)
        );

  const handleInstagramClick = () => {
    window.open('https://ig.me/m/cn.atheliers', '_blank', 'noopener,noreferrer');
  };

  const handleVerCatalogo = () => {
    catalogoRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const handleVerGaleria = () => {
    galeriaRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const agregarABolsa = (joya: Joya) => {
    const existe = bolsa.some((item) => item.id === joya.id);

    if (existe) {
      return;
    }

    setBolsa((actual) => [...actual, joya]);
    setBolsaAnimada(true);
    setMensajeCopiado(false);

    setTimeout(() => {
      setBolsaAnimada(false);
    }, 520);
  };

  const quitarDeBolsa = (id: number) => {
    setBolsa((actual) => actual.filter((joya) => joya.id !== id));
    setMensajeCopiado(false);
  };

  const crearMensajeConsulta = (items: Joya[]) => {
    if (items.length === 1) {
      const joya = items[0];

      return `Hola, me interesa esta pieza de Atheliers:

${joya.nombre}
Categoría: ${joya.categoria}
Precio: ${mostrarPrecio(joya.precio)}

¿Me puedes compartir disponibilidad?`;
    }

    const lista = items
      .map(
        (joya, index) =>
          `${index + 1}. ${joya.nombre} - ${joya.categoria} - ${mostrarPrecio(joya.precio)}`
      )
      .join('\n');

    return `Hola, me interesan estas piezas de Atheliers:

${lista}

Total estimado: ${mostrarPrecio(totalBolsa)}

¿Me puedes compartir disponibilidad?`;
  };

  const copiarMensajeYAbrirInstagram = async (items: Joya[]) => {
    if (items.length === 0) {
      return;
    }

    const mensaje = crearMensajeConsulta(items);

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(mensaje);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = mensaje;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.top = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      setMensajeCopiado(true);
    } catch (error) {
      console.error('No se pudo copiar el mensaje:', error);
      setMensajeCopiado(false);
    }

    setTimeout(() => {
      window.open('https://ig.me/m/cn.atheliers', '_blank', 'noopener,noreferrer');
    }, 250);
  };

  const consultarJoya = (joya: Joya) => {
    copiarMensajeYAbrirInstagram([joya]);
  };

  const consultarBolsa = () => {
    copiarMensajeYAbrirInstagram(bolsa);
  };

  const joyaEnBolsa = (id: number) => bolsa.some((joya) => joya.id === id);

  return (
    <main className="page">
      <div className="bgContenedor">
        <img
          src="/logo.png"
          alt=""
          aria-hidden="true"
          className="bgWatermarkFixed"
          ref={bgWatermarkRef}
        />
      </div>

      <section className="hero" ref={heroRef}>
        <div className="heroContenido">
          <p className="eyebrow">Colección artesanal</p>

          <h1>Atheliers</h1>

          <div className="line"></div>

          <p className="subtitle">
            Joyería elegante, minimalista y diseñada para destacar cada detalle.
          </p>

          <div className="heroActions">
            <button className="btnHero principal" type="button" onClick={handleVerCatalogo}>
              Ver catálogo
            </button>

            <button className="btnHero secundario" type="button" onClick={handleVerGaleria}>
              Explorar
            </button>
          </div>
        </div>

        <button className="scrollCue" type="button" onClick={handleVerGaleria}>
          <span>Desliza</span>
          <i></i>
        </button>
      </section>

      <section className="showcase" ref={galeriaRef}>
        <div className="showcaseIntro revealItem">
          <p>Atheliers</p>
          <h2>Una mirada a la colección</h2>
        </div>

        <div className="showcaseGrid">
          {galeriaPreview.map((item, index) => (
            <article
              key={item.id}
              className={`featurePanel featurePanel${item.id} revealItem`}
              style={{ transitionDelay: `${index * 140}ms` }}
            >
              <img
                className="featureImage"
                src={item.imagen}
                alt={item.titulo}
                loading="lazy"
                decoding="async"
              />

              <div className="featureOverlay"></div>

              <div className="featureContent">
                <p>{item.categoria}</p>
                <h3>{item.titulo}</h3>
                <span>{item.descripcion}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="catalogoZona" ref={catalogoRef}>
        <div className="catalogoIntro revealItem">
          <p>Catálogo</p>
          <h2>Piezas disponibles</h2>
          <span>Selecciona una categoría para explorar la colección.</span>
        </div>

        <div
          ref={menuPlaceholderRef}
          className="menuPlaceholder"
          style={{ height: menuFijo ? `${menuHeight}px` : 'auto' }}
        >
          <div ref={menuRef} className={`menuContenedor ${menuFijo ? 'fijo' : ''}`}>
            <nav className="menuCategorias">
              {categorias.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`btnCategoria ${filtro === cat ? 'activo' : ''}`}
                  onClick={() => setFiltro(cat)}
                >
                  {cat}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="contentWrapper">
          {cargando ? (
            <section className="gallery skeletonGrid" aria-label="Cargando catálogo">
              {Array.from({ length: 6 }).map((_, index) => (
                <article key={index} className="skeletonCard">
                  <div className="skeletonImage"></div>

                  <div className="skeletonInfo">
                    <div className="skeletonLine large"></div>
                    <div className="skeletonLine small"></div>
                  </div>
                </article>
              ))}
            </section>
          ) : errorCarga ? (
            <div className="estadoVacio">
              <p>No se pudo conectar con el catálogo.</p>
            </div>
          ) : joyasFiltradas.length === 0 ? (
            <div className="estadoVacio">
              <p>Próximamente nuevas piezas en esta colección.</p>
            </div>
          ) : (
            <section className="gallery">
              {joyasFiltradas.map((joya, index) => (
                <article
                  key={joya.id}
                  className="card revealCard"
                  style={{ transitionDelay: `${(index % 4) * 70}ms` }}
                  onClick={() => setJoyaSeleccionada(joya)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      setJoyaSeleccionada(joya);
                    }
                  }}
                >
                  <div className="imageBox">
                    <img
                      src={optimizarImagen(joya.imagen, 700)}
                      alt={joya.nombre}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>

                  <div className="info">
                    <div>
                      <h2>{joya.nombre}</h2>
                      <p className="category">{joya.categoria}</p>
                    </div>

                    <p className="price">{mostrarPrecio(joya.precio)}</p>
                  </div>

                  <button
                    className="btnDetalle"
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setJoyaSeleccionada(joya);
                    }}
                  >
                    Ver pieza
                  </button>
                </article>
              ))}
            </section>
          )}
        </div>
      </section>

      <footer className="piePagina">
        <div className="contenidoPie">
          <p className="footerBrand">Joyería artesanal · Piezas seleccionadas · México</p>

          <div className="footerLine"></div>

          <p className="footerRights">&copy; 2026 Atheliers. Todos los derechos reservados.</p>

          <div className="redes">
            <a
              href="https://instagram.com/cn.atheliers"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
          </div>
        </div>
      </footer>

      <button
        className={`btnBolsa ${bolsa.length === 0 ? 'vacia' : ''} ${
          bolsaAnimada ? 'animada' : ''
        }`}
        type="button"
        onClick={() => {
          setBolsaAbierta(true);
          setMensajeCopiado(false);
        }}
        aria-label="Abrir bolsa de consulta"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 8h12l-1 13H7L6 8z"></path>
          <path d="M9 8a3 3 0 0 1 6 0"></path>
        </svg>
        <span>Bolsa</span>
        <strong>{bolsa.length}</strong>
      </button>

      <button
        className="btnFlotanteInsta"
        onClick={handleInstagramClick}
        aria-label="Enviar mensaje"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>

        <span>DM</span>
      </button>

      {joyaSeleccionada && (
        <div className="modalOverlay" onClick={() => setJoyaSeleccionada(null)}>
          <section className="modalProducto" onClick={(event) => event.stopPropagation()}>
            <button
              className="btnCerrar"
              type="button"
              onClick={() => setJoyaSeleccionada(null)}
              aria-label="Cerrar"
            >
              ×
            </button>

            <div className="modalImagen">
              <img
                src={optimizarImagen(joyaSeleccionada.imagen, 1200)}
                alt={joyaSeleccionada.nombre}
                loading="eager"
                decoding="async"
              />
            </div>

            <div className="modalInfo">
              <p className="modalCategoria">{joyaSeleccionada.categoria}</p>
              <h3>{joyaSeleccionada.nombre}</h3>
              <p className="modalPrecio">{mostrarPrecio(joyaSeleccionada.precio)}</p>

              <p className="modalDescripcion">
                Pieza seleccionada de la colección Atheliers. Puedes consultar
                disponibilidad directamente por Instagram.
              </p>

              <p className="notaConsulta">
                El mensaje de esta pieza se copiará para que puedas pegarlo en Instagram.
              </p>

              <div className="modalAcciones">
                <button
                  className="btnModal principal"
                  type="button"
                  onClick={() => agregarABolsa(joyaSeleccionada)}
                >
                  {joyaEnBolsa(joyaSeleccionada.id) ? 'En bolsa' : 'Agregar a bolsa'}
                </button>

                <button
                  className="btnModal secundario"
                  type="button"
                  onClick={() => consultarJoya(joyaSeleccionada)}
                >
                  Consultar pieza
                </button>
              </div>

              {mensajeCopiado && (
                <p className="mensajeCopiado">
                  Mensaje copiado. Pégalo en Instagram para enviar tu consulta.
                </p>
              )}
            </div>
          </section>
        </div>
      )}

      {bolsaAbierta && (
        <div className="modalOverlay" onClick={() => setBolsaAbierta(false)}>
          <section className="panelBolsa" onClick={(event) => event.stopPropagation()}>
            <button
              className="btnCerrar"
              type="button"
              onClick={() => setBolsaAbierta(false)}
              aria-label="Cerrar"
            >
              ×
            </button>

            <div className="bolsaHeader">
              <p>Bolsa de consulta</p>
              <h3>Piezas seleccionadas</h3>
              <span>{bolsa.length} pieza{bolsa.length === 1 ? '' : 's'} en tu bolsa</span>
            </div>

            <div className="bolsaLista">
              {bolsa.length === 0 ? (
                <div className="bolsaVacia">
                  <p>Tu bolsa está vacía.</p>
                  <span>Agrega piezas del catálogo para consultarlas por Instagram.</span>
                </div>
              ) : (
                bolsa.map((joya) => (
                  <div key={joya.id} className="bolsaItem">
                    <img
                      src={optimizarImagen(joya.imagen, 220)}
                      alt={joya.nombre}
                      loading="lazy"
                      decoding="async"
                    />

                    <div>
                      <h4>{joya.nombre}</h4>
                      <p>{joya.categoria}</p>
                      <span>{mostrarPrecio(joya.precio)}</span>
                    </div>

                    <button type="button" onClick={() => quitarDeBolsa(joya.id)}>
                      Quitar
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="bolsaFooter">
              <div>
                <span>Total estimado</span>
                <strong>{mostrarPrecio(totalBolsa)}</strong>
              </div>

              <p className="notaConsulta bolsaNota">
                Copiaremos tu selección para que puedas pegarla en el chat de Instagram.
              </p>

              <button
                className="btnConsultarBolsa"
                type="button"
                onClick={consultarBolsa}
                disabled={bolsa.length === 0}
              >
                Consultar por Instagram
              </button>

              {mensajeCopiado && (
                <p className="mensajeCopiado">
                  Mensaje copiado. Pégalo en Instagram para enviar tu consulta.
                </p>
              )}
            </div>
          </section>
        </div>
      )}

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&display=swap');

        .page {
          position: relative;
          min-height: 100dvh;
          background: #fffdfb;
          color: #3a171b;
          padding: 0;
          display: flex;
          flex-direction: column;
          overflow-x: hidden;
        }

        .bgContenedor {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          z-index: 0;
          pointer-events: none;
        }

        .bgWatermarkFixed {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 130vw;
          max-width: 1800px;
          height: auto;
          object-fit: contain;
          opacity: 0.035;
          will-change: transform;
        }

        .hero {
          position: relative;
          min-height: 100svh;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 80px 20px;
          max-width: 980px;
          width: 100%;
          margin: 0 auto;
          z-index: 10;
          will-change: transform, opacity;
        }

        .heroContenido {
          transform: translateY(-10px);
        }

        .eyebrow {
          margin-bottom: 20px;
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 4px;
          color: #9a6a5e;
          font-weight: 400;
          text-align: center;
        }

        h1 {
          margin: 0;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(4.5rem, 12vw, 9.5rem);
          font-weight: 300;
          letter-spacing: 4px;
          color: #4a1e23;
          text-transform: uppercase;
          line-height: 1;
          text-align: center;
        }

        .line {
          width: 56px;
          height: 1px;
          margin: 32px auto;
          background: #4a1e23;
          opacity: 0.45;
        }

        .subtitle {
          margin: 0 auto;
          max-width: 520px;
          font-size: 1.05rem;
          line-height: 1.8;
          color: #7b6460;
          font-weight: 300;
          text-align: center;
        }

        .heroActions {
          margin-top: 38px;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
        }

        .btnHero {
          background: transparent;
          border-radius: 999px;
          padding: 13px 28px;
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          cursor: pointer;
          transition:
            background 0.35s ease,
            color 0.35s ease,
            transform 0.35s ease,
            border-color 0.35s ease;
        }

        .btnHero.principal {
          color: #f9f5f1;
          background: #4a1e23;
          border: 1px solid #4a1e23;
        }

        .btnHero.secundario {
          color: #4a1e23;
          border: 1px solid rgba(74, 30, 35, 0.25);
        }

        .btnHero:hover {
          transform: translateY(-2px);
        }

        .btnHero.secundario:hover {
          background: #4a1e23;
          color: #f9f5f1;
          border-color: #4a1e23;
        }

        .btnHero.principal:hover {
          background: #3a171b;
          border-color: #3a171b;
        }

        .scrollCue {
          position: absolute;
          bottom: 34px;
          left: 50%;
          transform: translateX(-50%);
          border: none;
          background: transparent;
          color: #9a6a5e;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          opacity: 0.72;
          transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .scrollCue:hover {
          opacity: 1;
          transform: translateX(-50%) translateY(-2px);
        }

        .scrollCue span {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 2.5px;
        }

        .scrollCue i {
          width: 1px;
          height: 36px;
          background: rgba(74, 30, 35, 0.28);
          position: relative;
          overflow: hidden;
        }

        .scrollCue i::after {
          content: '';
          position: absolute;
          top: -18px;
          left: 0;
          width: 1px;
          height: 18px;
          background: #4a1e23;
          animation: scrollLinea 1.8s ease-in-out infinite;
        }

        @keyframes scrollLinea {
          0% {
            transform: translateY(0);
            opacity: 0;
          }

          30% {
            opacity: 1;
          }

          100% {
            transform: translateY(54px);
            opacity: 0;
          }
        }

        .showcase {
          position: relative;
          z-index: 15;
          width: 100%;
          max-width: 1440px;
          margin: 0 auto 165px;
          padding: 22px 5% 0;
          box-sizing: border-box;
          scroll-margin-top: 70px;
        }

        .showcaseIntro {
          text-align: center;
          margin: 0 auto 46px;
          max-width: 620px;
        }

        .showcaseIntro p {
          margin: 0 0 12px;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 3.4px;
          color: #9a6a5e;
        }

        .showcaseIntro h2 {
          margin: 0;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(2.4rem, 5vw, 4.6rem);
          font-weight: 300;
          line-height: 1;
          text-transform: none;
          letter-spacing: 1px;
          color: #4a1e23;
        }

        .showcaseGrid {
          display: grid;
          grid-template-columns: 1.08fr 0.92fr;
          grid-template-rows: 410px 410px;
          gap: 24px;
        }

        .featurePanel {
          position: relative;
          overflow: hidden;
          background: transparent;
          isolation: isolate;
        }

        .featurePanel1 {
          grid-row: span 2;
        }

        .featureImage {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          border: none;
          z-index: 1;
          transform: scale(1.045);
          opacity: 1;
          filter: saturate(1.04) brightness(1.03) contrast(1.04);
          transition:
            transform 1.35s cubic-bezier(0.16, 1, 0.3, 1),
            opacity 1.15s cubic-bezier(0.16, 1, 0.3, 1),
            filter 1.15s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .featureOverlay {
          position: absolute;
          inset: 0;
          z-index: 2;
          background: transparent;
          pointer-events: none;
        }

        .featureContent {
          position: absolute;
          left: clamp(20px, 3vw, 38px);
          bottom: clamp(20px, 3vw, 38px);
          right: auto;
          top: auto;
          z-index: 3;
          max-width: 260px;
          padding: 12px 14px 13px;
          color: #fffdfb;
          opacity: 0;
          text-align: left;
          transform: translateY(24px);
          text-shadow:
            0 1px 1px rgba(58, 23, 27, 0.24),
            0 10px 24px rgba(58, 23, 27, 0.3);
          isolation: isolate;
          transition:
            opacity 1s cubic-bezier(0.16, 1, 0.3, 1),
            transform 1.05s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .featureContent::before {
          content: '';
          position: absolute;
          inset: -11px -62px -12px -15px;
          z-index: -1;
          border-radius: 20px;
          background:
            radial-gradient(
              ellipse at 0% 100%,
              rgba(58, 23, 27, 0.3),
              rgba(58, 23, 27, 0.16) 38%,
              rgba(58, 23, 27, 0.055) 64%,
              transparent 100%
            );
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          opacity: 0.68;
        }

        .featureContent p {
          margin: 0 0 7px;
          font-size: 0.55rem;
          text-transform: uppercase;
          letter-spacing: 2.5px;
          color: rgba(255, 253, 251, 0.78);
        }

        .featureContent h3 {
          margin: 0;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(1.28rem, 2.25vw, 2.25rem);
          font-weight: 300;
          line-height: 0.98;
          letter-spacing: 0.4px;
          color: rgba(255, 253, 251, 0.96);
        }

        .featureContent span {
          display: block;
          margin-top: 8px;
          max-width: 235px;
          font-size: 0.69rem;
          line-height: 1.5;
          color: rgba(255, 253, 251, 0.74);
          font-weight: 300;
        }

        .featurePanel2 .featureContent,
        .featurePanel3 .featureContent {
          max-width: 235px;
          padding: 11px 13px 12px;
        }

        .featurePanel2 .featureContent h3,
        .featurePanel3 .featureContent h3 {
          font-size: clamp(1.08rem, 1.65vw, 1.68rem);
        }

        .featurePanel2 .featureContent span,
        .featurePanel3 .featureContent span {
          font-size: 0.65rem;
          max-width: 205px;
        }

        .featurePanel.visible .featureImage {
          transform: scale(1);
          opacity: 1;
          filter: saturate(1.08) brightness(1.04) contrast(1.05);
        }

        .featurePanel.visible .featureContent {
          opacity: 1;
          transform: translateY(0);
        }

        .featurePanel:hover .featureImage {
          transform: scale(1.018);
        }

        .catalogoZona {
          position: relative;
          z-index: 300;
          width: 100%;
          margin-top: 0;
          overflow: visible;
          scroll-margin-top: 120px;
        }

        .catalogoIntro {
          position: relative;
          z-index: 10;
          max-width: 640px;
          margin: 0 auto 34px;
          padding: 0 20px;
          text-align: center;
        }

        .catalogoIntro p {
          margin: 0 0 12px;
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 3.5px;
          color: #9a6a5e;
        }

        .catalogoIntro h2 {
          margin: 0;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(2.5rem, 6vw, 4.8rem);
          font-weight: 300;
          line-height: 1;
          color: #4a1e23;
          text-transform: none;
          letter-spacing: 1px;
        }

        .catalogoIntro span {
          display: block;
          margin-top: 16px;
          font-size: 0.95rem;
          line-height: 1.7;
          color: #7b6460;
        }

        .menuPlaceholder {
          position: relative;
          width: 100%;
          z-index: 1000;
          margin-bottom: 0;
        }

        .menuContenedor {
          position: relative;
          z-index: 1000;
          display: flex;
          justify-content: center;
          width: 100%;
          padding: 18px 5% 0;
          background: transparent;
          box-sizing: border-box;
        }

        .menuContenedor.fijo {
          position: fixed;
          top: 18px;
          left: 0;
          right: 0;
          width: 100%;
          z-index: 1000;
          padding: 0 5%;
        }

        .menuCategorias {
          display: flex;
          justify-content: center;
          gap: 40px;
          flex-wrap: wrap;
          background: rgba(255, 253, 251, 0.9);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          padding: 15px 30px;
          border-radius: 50px;
          box-shadow: 0 8px 28px rgba(74, 30, 35, 0.06);
          border: 1px solid rgba(74, 30, 35, 0.06);
        }

        .btnCategoria {
          background: none;
          border: none;
          font-family: 'system-ui', -apple-system, sans-serif;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #a28b85;
          cursor: pointer;
          padding-bottom: 5px;
          border-bottom: 1px solid transparent;
          transition:
            color 0.3s ease,
            border-color 0.3s ease,
            transform 0.3s ease;
        }

        .btnCategoria:hover {
          color: #4a1e23;
          transform: translateY(-1px);
        }

        .btnCategoria.activo {
          color: #4a1e23;
          border-bottom: 1px solid #4a1e23;
        }

        .contentWrapper {
          position: relative;
          background: transparent;
          padding: 112px 5% 40px;
          max-width: 1280px;
          width: 100%;
          margin: 0 auto;
          z-index: 20;
          box-sizing: border-box;
        }

        .estadoVacio {
          text-align: center;
          padding: 80px 20px;
          color: #a28b85;
          font-size: 1.4rem;
          font-style: italic;
          font-family: 'Cormorant Garamond', Georgia, serif;
        }

        .gallery {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 60px 46px;
        }

        .skeletonGrid {
          pointer-events: none;
        }

        .skeletonCard {
          background: transparent;
        }

        .skeletonImage {
          aspect-ratio: 3 / 4;
          border-radius: 12px;
          background: linear-gradient(
            90deg,
            rgba(238, 232, 229, 0.65),
            rgba(255, 253, 251, 0.95),
            rgba(238, 232, 229, 0.65)
          );
          background-size: 240% 100%;
          animation: skeletonShimmer 1.8s ease-in-out infinite;
        }

        .skeletonInfo {
          padding: 18px 5px 5px;
        }

        .skeletonLine {
          height: 10px;
          border-radius: 999px;
          background: linear-gradient(
            90deg,
            rgba(238, 232, 229, 0.7),
            rgba(255, 253, 251, 1),
            rgba(238, 232, 229, 0.7)
          );
          background-size: 240% 100%;
          animation: skeletonShimmer 1.8s ease-in-out infinite;
        }

        .skeletonLine.large {
          width: 62%;
        }

        .skeletonLine.small {
          width: 38%;
          margin-top: 10px;
        }

        @keyframes skeletonShimmer {
          0% {
            background-position: 100% 0;
          }

          100% {
            background-position: -100% 0;
          }
        }

        .card {
          background: transparent;
          padding: 0;
          border-radius: 0;
          box-shadow: none;
          transition:
            transform 0.55s cubic-bezier(0.16, 1, 0.3, 1),
            opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform;
          cursor: pointer;
          outline: none;
        }

        .card:hover {
          transform: translateY(-10px);
        }

        .card:focus-visible {
          outline: 1px solid rgba(74, 30, 35, 0.35);
          outline-offset: 8px;
        }

        .imageBox {
          aspect-ratio: 3 / 4;
          overflow: hidden;
          border-radius: 12px;
          background: #eee8e5;
          box-shadow: 0 4px 15px rgba(74, 30, 35, 0.02);
          transition:
            box-shadow 0.55s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.55s cubic-bezier(0.16, 1, 0.3, 1),
            border-radius 0.55s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .card:hover .imageBox {
          transform: translateY(-4px);
          box-shadow: 0 20px 42px rgba(74, 30, 35, 0.09);
          border-radius: 14px;
        }

        .imageBox img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transform: scale(1.025);
          filter: saturate(0.96) brightness(1.01);
          transition:
            transform 1.15s cubic-bezier(0.16, 1, 0.3, 1),
            filter 0.9s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .card:hover img {
          transform: scale(1.075);
          filter: saturate(1.04) brightness(1.02);
        }

        .info {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 15px;
          padding: 18px 5px 5px;
          transition:
            transform 0.45s cubic-bezier(0.16, 1, 0.3, 1),
            opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .card:hover .info {
          transform: translateY(-3px);
        }

        h2 {
          margin: 0;
          font-size: 0.82rem;
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 2.2px;
          color: #4a1e23;
          transition:
            letter-spacing 0.45s ease,
            color 0.45s ease;
        }

        .card:hover h2 {
          letter-spacing: 2.8px;
          color: #3a171b;
        }

        .category {
          margin: 7px 0 0;
          font-size: 0.76rem;
          color: #a28b85;
          font-weight: 300;
          transition: color 0.45s ease;
        }

        .card:hover .category {
          color: #8e746e;
        }

        .price {
          margin: 0;
          white-space: nowrap;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.1rem;
          color: #4a1e23;
          font-weight: 500;
          transition:
            transform 0.45s cubic-bezier(0.16, 1, 0.3, 1),
            color 0.45s ease;
        }

        .card:hover .price {
          transform: translateY(-1px);
          color: #3a171b;
        }

        .btnDetalle {
          margin: 8px 5px 0;
          background: transparent;
          border: none;
          padding: 0;
          color: #9a6a5e;
          font-size: 0.68rem;
          text-transform: uppercase;
          letter-spacing: 1.8px;
          cursor: pointer;
          opacity: 0;
          transform: translateY(8px);
          transition:
            opacity 0.35s ease,
            transform 0.35s ease,
            color 0.35s ease;
        }

        .card:hover .btnDetalle {
          opacity: 1;
          transform: translateY(0);
        }

        .btnDetalle:hover {
          color: #4a1e23;
        }

        .revealItem {
          opacity: 0;
          transform: translateY(72px) scale(0.975);
          transition:
            opacity 1.05s cubic-bezier(0.16, 1, 0.3, 1),
            transform 1.1s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity, transform;
        }

        .revealItem.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .revealCard {
          opacity: 0;
          transform: translateY(44px) scale(0.985);
          transition:
            opacity 0.95s cubic-bezier(0.16, 1, 0.3, 1),
            transform 1s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity, transform;
        }

        .revealCard.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .piePagina {
          position: relative;
          z-index: 20;
          width: 100%;
          box-sizing: border-box;
          border-top: 1px solid rgba(74, 30, 35, 0.08);
          padding: 52px 5% 96px;
          margin-top: auto;
        }

        .contenidoPie {
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 16px;
          font-size: 0.8rem;
          color: #a28b85;
          font-family: 'system-ui', -apple-system, sans-serif;
          text-align: center;
        }

        .contenidoPie p {
          margin: 0;
        }

        .footerBrand {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(1.35rem, 3vw, 2rem);
          font-weight: 300;
          letter-spacing: 0.5px;
          color: #4a1e23;
        }

        .footerLine {
          width: 46px;
          height: 1px;
          background: rgba(74, 30, 35, 0.18);
          margin: 2px 0;
        }

        .footerRights {
          font-size: 0.76rem;
          color: #a28b85;
        }

        .redes {
          display: flex;
          gap: 24px;
          justify-content: center;
          align-items: center;
        }

        .redes a {
          color: #7b6460;
          text-decoration: none;
          transition:
            color 0.3s ease,
            transform 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1.4px;
          font-size: 0.76rem;
        }

        .redes a:hover {
          color: #4a1e23;
          transform: translateY(-1px);
        }

        .btnBolsa,
        .btnFlotanteInsta {
          position: fixed;
          bottom: 30px;
          border: none;
          border-radius: 50px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'system-ui', -apple-system, sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          letter-spacing: 1px;
          cursor: pointer;
          z-index: 1200;
          transition: all 0.3s ease;
        }

        .btnBolsa {
          left: 30px;
          background: rgba(255, 253, 251, 0.9);
          color: #3a171b;
          border: 1px solid rgba(74, 30, 35, 0.1);
          padding: 14px 20px;
          box-shadow: 0 8px 25px rgba(58, 23, 27, 0.12);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
        }

        .btnBolsa:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 30px rgba(58, 23, 27, 0.18);
        }

        .btnBolsa.vacia {
          opacity: 0.72;
        }

        .btnBolsa.vacia strong {
          background: rgba(74, 30, 35, 0.12);
          color: #4a1e23;
        }

        .btnBolsa.animada {
          animation: bolsaPop 0.52s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .btnBolsa.animada strong {
          animation: contadorPop 0.52s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes bolsaPop {
          0% {
            transform: translateY(0) scale(1);
          }

          45% {
            transform: translateY(-6px) scale(1.035);
          }

          100% {
            transform: translateY(0) scale(1);
          }
        }

        @keyframes contadorPop {
          0% {
            transform: scale(1);
          }

          45% {
            transform: scale(1.28);
          }

          100% {
            transform: scale(1);
          }
        }

        .btnBolsa svg,
        .btnFlotanteInsta svg {
          width: 20px;
          height: 20px;
        }

        .btnBolsa strong {
          display: grid;
          place-items: center;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #4a1e23;
          color: #fffdfb;
          font-size: 0.72rem;
          font-weight: 500;
        }

        .btnFlotanteInsta {
          right: 30px;
          background: #3a171b;
          color: #f9f5f1;
          padding: 14px 24px;
          box-shadow: 0 8px 25px rgba(58, 23, 27, 0.25);
        }

        .btnFlotanteInsta:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 30px rgba(58, 23, 27, 0.35);
          background: #4a1e23;
        }

        .modalOverlay {
          position: fixed;
          inset: 0;
          z-index: 2000;
          background: rgba(58, 23, 27, 0.22);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 24px;
          animation: overlayEntrada 0.35s ease both;
        }

        @keyframes overlayEntrada {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        .modalProducto,
        .panelBolsa {
          position: relative;
          width: min(960px, 100%);
          max-height: min(820px, 90dvh);
          overflow: auto;
          background: rgba(255, 253, 251, 0.94);
          border: 1px solid rgba(74, 30, 35, 0.08);
          box-shadow: 0 28px 70px rgba(58, 23, 27, 0.22);
          animation: modalEntrada 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .modalProducto {
          display: grid;
          grid-template-columns: 1fr 0.9fr;
        }

        .panelBolsa {
          max-width: 680px;
          padding: 42px;
        }

        @keyframes modalEntrada {
          from {
            opacity: 0;
            transform: translateY(34px) scale(0.975);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .btnCerrar {
          position: absolute;
          top: 18px;
          right: 18px;
          z-index: 5;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1px solid rgba(74, 30, 35, 0.1);
          background: rgba(255, 253, 251, 0.82);
          color: #4a1e23;
          font-size: 1.5rem;
          line-height: 1;
          cursor: pointer;
          transition:
            transform 0.3s ease,
            background 0.3s ease;
        }

        .btnCerrar:hover {
          transform: rotate(90deg);
          background: #fffdfb;
        }

        .modalImagen {
          min-height: 620px;
          background: #eee8e5;
          overflow: hidden;
        }

        .modalImagen img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .modalInfo {
          padding: 70px 48px 48px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .modalCategoria,
        .bolsaHeader p {
          margin: 0 0 14px;
          color: #9a6a5e;
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 3px;
        }

        .modalInfo h3,
        .bolsaHeader h3 {
          margin: 0;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(2.7rem, 5vw, 5rem);
          font-weight: 300;
          line-height: 0.98;
          color: #4a1e23;
        }

        .modalPrecio {
          margin: 22px 0 0;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.7rem;
          color: #3a171b;
        }

        .modalDescripcion {
          margin: 28px 0 0;
          color: #7b6460;
          line-height: 1.8;
          font-size: 0.95rem;
        }

        .notaConsulta {
          margin: 22px 0 0;
          color: #9a6a5e;
          font-size: 0.82rem;
          line-height: 1.65;
          font-style: italic;
        }

        .bolsaNota {
          margin: 0;
          text-align: center;
        }

        .modalAcciones {
          margin-top: 24px;
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .btnModal,
        .btnConsultarBolsa {
          border-radius: 999px;
          padding: 13px 22px;
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 1.7px;
          cursor: pointer;
          transition:
            transform 0.3s ease,
            background 0.3s ease,
            color 0.3s ease,
            border-color 0.3s ease;
        }

        .btnModal:hover,
        .btnConsultarBolsa:hover {
          transform: translateY(-2px);
        }

        .btnModal.principal,
        .btnConsultarBolsa {
          background: #4a1e23;
          color: #fffdfb;
          border: 1px solid #4a1e23;
        }

        .btnModal.secundario {
          background: transparent;
          color: #4a1e23;
          border: 1px solid rgba(74, 30, 35, 0.18);
        }

        .btnModal.secundario:hover {
          background: #4a1e23;
          color: #fffdfb;
        }

        .btnConsultarBolsa:disabled {
          opacity: 0.45;
          cursor: not-allowed;
          transform: none;
        }

        .btnConsultarBolsa:disabled:hover {
          transform: none;
        }

        .mensajeCopiado {
          margin: 18px 0 0;
          color: #7b6460;
          font-size: 0.82rem;
          line-height: 1.6;
        }

        .bolsaHeader {
          text-align: center;
          margin-bottom: 34px;
        }

        .bolsaHeader h3 {
          font-size: clamp(2.3rem, 5vw, 4rem);
        }

        .bolsaHeader span {
          display: block;
          margin-top: 14px;
          color: #7b6460;
          font-size: 0.92rem;
        }

        .bolsaLista {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .bolsaVacia {
          text-align: center;
          padding: 34px 20px;
          border: 1px solid rgba(74, 30, 35, 0.08);
          color: #7b6460;
        }

        .bolsaVacia p {
          margin: 0 0 8px;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.6rem;
          color: #4a1e23;
        }

        .bolsaVacia span {
          font-size: 0.86rem;
          line-height: 1.6;
        }

        .bolsaItem {
          display: grid;
          grid-template-columns: 74px 1fr auto;
          gap: 16px;
          align-items: center;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(74, 30, 35, 0.08);
        }

        .bolsaItem img {
          width: 74px;
          height: 92px;
          object-fit: cover;
          background: #eee8e5;
        }

        .bolsaItem h4 {
          margin: 0;
          font-size: 0.82rem;
          text-transform: uppercase;
          letter-spacing: 1.8px;
          color: #4a1e23;
        }

        .bolsaItem p {
          margin: 6px 0;
          color: #a28b85;
          font-size: 0.76rem;
        }

        .bolsaItem span {
          font-family: 'Cormorant Garamond', Georgia, serif;
          color: #3a171b;
          font-size: 1.1rem;
        }

        .bolsaItem button {
          background: transparent;
          border: none;
          color: #9a6a5e;
          cursor: pointer;
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .bolsaItem button:hover {
          color: #4a1e23;
        }

        .bolsaFooter {
          margin-top: 28px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .bolsaFooter > div {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #7b6460;
          font-size: 0.88rem;
        }

        .bolsaFooter strong {
          font-family: 'Cormorant Garamond', Georgia, serif;
          color: #3a171b;
          font-size: 1.45rem;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .hero {
            min-height: 100svh;
            padding: 70px 20px;
          }

          .heroContenido {
            transform: translateY(-6px);
          }

          h1 {
            font-size: clamp(3.5rem, 15vw, 5rem);
          }

          .heroActions {
            margin-top: 32px;
            gap: 12px;
          }

          .btnHero {
            padding: 12px 22px;
            font-size: 0.7rem;
          }

          .scrollCue {
            bottom: 26px;
          }

          .showcase {
            max-width: 1120px;
            margin: 0 auto 115px;
            padding: 28px 15px 0;
          }

          .showcaseIntro {
            margin-bottom: 30px;
          }

          .showcaseGrid {
            grid-template-columns: 1fr;
            grid-template-rows: none;
            gap: 18px;
          }

          .featurePanel,
          .featurePanel1,
          .featurePanel2,
          .featurePanel3 {
            min-height: 430px;
          }

          .featurePanel1 {
            min-height: 560px;
          }

          .featureContent,
          .featurePanel2 .featureContent,
          .featurePanel3 .featureContent {
            left: 20px;
            bottom: 20px;
            right: auto;
            top: auto;
            max-width: 225px;
            padding: 11px 12px 12px;
          }

          .featureContent h3,
          .featurePanel2 .featureContent h3,
          .featurePanel3 .featureContent h3 {
            font-size: clamp(1.25rem, 6.4vw, 2.15rem);
          }

          .featureContent span,
          .featurePanel2 .featureContent span,
          .featurePanel3 .featureContent span {
            font-size: 0.64rem;
            margin-top: 7px;
            max-width: 195px;
          }

          .catalogoIntro {
            margin-bottom: 28px;
          }

          .menuContenedor {
            padding: 14px 15px 0;
          }

          .menuContenedor.fijo {
            top: 10px;
            padding: 0 15px;
          }

          .menuCategorias {
            gap: 15px;
            padding: 12px 20px;
          }

          .btnCategoria {
            font-size: 0.75rem;
            letter-spacing: 1px;
          }

          .contentWrapper {
            padding: 108px 15px 40px;
          }

          .gallery {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 28px 15px;
          }

          .info {
            flex-direction: column;
            gap: 8px;
          }

          .btnDetalle {
            opacity: 1;
            transform: translateY(0);
            font-size: 0.64rem;
          }

          .footerBrand {
            max-width: 260px;
            line-height: 1.25;
          }

          .btnBolsa {
            left: 20px;
            bottom: 20px;
            padding: 12px 16px;
          }

          .btnBolsa span {
            display: none;
          }

          .btnFlotanteInsta {
            bottom: 20px;
            right: 20px;
            padding: 12px 20px;
          }

          .modalOverlay {
            padding: 14px;
            align-items: flex-end;
          }

          .modalProducto {
            grid-template-columns: 1fr;
            max-height: 92dvh;
          }

          .modalImagen {
            min-height: 320px;
            max-height: 420px;
          }

          .modalInfo {
            padding: 36px 24px 28px;
          }

          .modalInfo h3 {
            font-size: clamp(2.4rem, 11vw, 4rem);
          }

          .modalAcciones {
            flex-direction: column;
          }

          .btnModal,
          .btnConsultarBolsa {
            width: 100%;
          }

          .panelBolsa {
            padding: 38px 22px 24px;
            max-height: 92dvh;
          }

          .bolsaItem {
            grid-template-columns: 62px 1fr;
            gap: 12px;
            position: relative;
          }

          .bolsaItem img {
            width: 62px;
            height: 78px;
          }

          .bolsaItem button {
            grid-column: 2;
            justify-self: flex-start;
            padding: 0;
          }
        }
      `}</style>
    </main>
  );
}