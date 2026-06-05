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
      imagen: '/logo.png',
    },
    {
      id: 2,
      titulo: 'Elegancia minimalista',
      categoria: 'Atheliers',
      descripcion: 'Formas limpias, tonos suaves y detalles delicados.',
      imagen: '/logo.png',
    },
    {
      id: 3,
      titulo: 'Detalles únicos',
      categoria: 'Atheliers',
      descripcion: 'Una mirada previa antes de explorar el catálogo completo.',
      imagen: '/logo.png',
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

  const normalizarTexto = (texto: string | null | undefined) =>
    String(texto ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();

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
              <img className="featureImage" src={item.imagen} alt={item.titulo} />

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
            <div className="estadoVacio">
              <p>Conectando al atelier...</p>
            </div>
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
                >
                  <div className="imageBox">
                    <img src={joya.imagen} alt={joya.nombre} />
                  </div>

                  <div className="info">
                    <div>
                      <h2>{joya.nombre}</h2>
                      <p className="category">{joya.categoria}</p>
                    </div>

                    <p className="price">${joya.precio}</p>
                  </div>
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
          max-width: 1280px;
          margin: 0 auto 135px;
          padding: 22px 5% 0;
          box-sizing: border-box;
          scroll-margin-top: 70px;
        }

        .showcaseIntro {
          text-align: center;
          margin: 0 auto 42px;
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
          grid-template-columns: 1.2fr 0.8fr;
          grid-template-rows: 285px 285px;
          gap: 22px;
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
          border: none;
          z-index: 1;
          transform: scale(1.08);
          opacity: 0.7;
          filter: saturate(0.82) brightness(1.04);
          transition:
            transform 1.35s cubic-bezier(0.16, 1, 0.3, 1),
            opacity 1.15s cubic-bezier(0.16, 1, 0.3, 1),
            filter 1.15s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .featureOverlay {
          position: absolute;
          inset: 0;
          z-index: 2;
          background: linear-gradient(
            180deg,
            rgba(252, 250, 249, 0.08),
            rgba(252, 250, 249, 0.42)
          );
          pointer-events: none;
        }

        .featureContent {
          position: absolute;
          left: clamp(24px, 5vw, 58px);
          bottom: clamp(24px, 4.5vw, 52px);
          z-index: 3;
          max-width: 430px;
          color: #4a1e23;
          opacity: 0;
          transform: translateY(38px);
          text-shadow: 0 16px 42px rgba(252, 250, 248, 0.88);
          transition:
            opacity 1s cubic-bezier(0.16, 1, 0.3, 1),
            transform 1.05s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .featureContent p {
          margin: 0 0 10px;
          font-size: 0.68rem;
          text-transform: uppercase;
          letter-spacing: 2.8px;
          color: #9a6a5e;
        }

        .featureContent h3 {
          margin: 0;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(2.2rem, 5vw, 5.4rem);
          font-weight: 300;
          line-height: 0.94;
          letter-spacing: 1px;
        }

        .featureContent span {
          display: block;
          margin-top: 14px;
          max-width: 360px;
          font-size: 0.92rem;
          line-height: 1.65;
          color: #7b6460;
          font-weight: 300;
        }

        .featurePanel2 .featureContent,
        .featurePanel3 .featureContent {
          max-width: 330px;
        }

        .featurePanel2 .featureContent h3,
        .featurePanel3 .featureContent h3 {
          font-size: clamp(1.9rem, 3.2vw, 3.2rem);
        }

        .featurePanel.visible .featureImage {
          transform: scale(1);
          opacity: 1;
          filter: saturate(1) brightness(1);
        }

        .featurePanel.visible .featureContent {
          opacity: 1;
          transform: translateY(0);
        }

        .featurePanel:hover .featureImage {
          transform: scale(1.025);
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

        .card {
          background: transparent;
          padding: 0;
          border-radius: 0;
          box-shadow: none;
          transition:
            transform 0.55s cubic-bezier(0.16, 1, 0.3, 1),
            opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform;
        }

        .card:hover {
          transform: translateY(-10px);
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

        .btnFlotanteInsta {
          position: fixed;
          bottom: 30px;
          right: 30px;
          background: #3a171b;
          color: #f9f5f1;
          border: none;
          border-radius: 50px;
          padding: 14px 24px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'system-ui', -apple-system, sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          letter-spacing: 1px;
          cursor: pointer;
          z-index: 1200;
          box-shadow: 0 8px 25px rgba(58, 23, 27, 0.25);
          transition: all 0.3s ease;
        }

        .btnFlotanteInsta:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 30px rgba(58, 23, 27, 0.35);
          background: #4a1e23;
        }

        .btnFlotanteInsta svg {
          width: 20px;
          height: 20px;
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
            margin: 0 auto 92px;
            padding: 28px 15px 0;
          }

          .showcaseIntro {
            margin-bottom: 30px;
          }

          .showcaseGrid {
            grid-template-columns: 1fr;
            grid-template-rows: none;
            gap: 16px;
          }

          .featurePanel,
          .featurePanel1,
          .featurePanel2,
          .featurePanel3 {
            min-height: 295px;
          }

          .featurePanel1 {
            min-height: 380px;
          }

          .featureContent {
            left: 22px;
            right: 22px;
            bottom: 26px;
          }

          .featureContent h3 {
            font-size: clamp(2.4rem, 11vw, 4.4rem);
          }

          .featurePanel2 .featureContent h3,
          .featurePanel3 .featureContent h3 {
            font-size: clamp(2.1rem, 9vw, 3.4rem);
          }

          .featureContent span {
            font-size: 0.9rem;
            margin-top: 12px;
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

          .footerBrand {
            max-width: 260px;
            line-height: 1.25;
          }

          .btnFlotanteInsta {
            bottom: 20px;
            right: 20px;
            padding: 12px 20px;
          }
        }
      `}</style>
    </main>
  );
}