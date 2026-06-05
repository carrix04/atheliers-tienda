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
  const [catalogoActivo, setCatalogoActivo] = useState(false);

  const bgWatermarkRef = useRef<HTMLImageElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const showcaseRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuPlaceholderRef = useRef<HTMLDivElement>(null);

  const categorias = ['Todas', 'Anillos', 'Pulseras', 'Collares'];

  const galeriaPreview: GaleriaItem[] = [
    {
      id: 1,
      titulo: 'Diseno artesanal',
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
      titulo: 'Detalles unicos',
      categoria: 'Atheliers',
      descripcion: 'Una mirada previa antes de explorar el catalogo completo.',
      imagen: '/logo.png',
    },
  ];

  useEffect(() => {
    const cargarJoyas = async () => {
      try {
        const res = await fetch(
          'https://atheliers-backend.onrender.com/api/joyas/',
          {
            cache: 'no-store',
          }
        );

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
          scroll * 0.1
        }px))`;
      }

      if (heroRef.current) {
        const opacity = Math.max(0, 1 - scroll / 220);
        heroRef.current.style.transform = `translateY(${scroll * 0.35}px)`;
        heroRef.current.style.opacity = opacity.toString();
        heroRef.current.style.pointerEvents = opacity === 0 ? 'none' : 'auto';
      }

      const inicioGaleria = 35;
      const salidaGaleria = window.innerWidth <= 768 ? 250 : 270;

      if (showcaseRef.current) {
        if (scroll <= inicioGaleria) {
          showcaseRef.current.classList.remove('is-visible', 'is-hidden-up');
          setCatalogoActivo((actual) => (actual === false ? actual : false));
        } else if (scroll > inicioGaleria && scroll <= salidaGaleria) {
          showcaseRef.current.classList.add('is-visible');
          showcaseRef.current.classList.remove('is-hidden-up');
          setCatalogoActivo((actual) => (actual === false ? actual : false));
        } else {
          showcaseRef.current.classList.remove('is-visible');
          showcaseRef.current.classList.add('is-hidden-up');
          setCatalogoActivo((actual) => (actual === true ? actual : true));
        }
      }

      if (menuPlaceholderRef.current && menuRef.current) {
        const topOffset = window.innerWidth <= 768 ? 10 : 20;
        const menuInicio =
          menuPlaceholderRef.current.getBoundingClientRect().top +
          window.scrollY;

        const alturaMenu = menuRef.current.offsetHeight;

        setMenuHeight((actual) =>
          actual === alturaMenu ? actual : alturaMenu
        );

        const debeFijarse = window.scrollY + topOffset >= menuInicio;

        setMenuFijo((actual) =>
          actual === debeFijarse ? actual : debeFijarse
        );
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
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('card-visible');
          } else {
            entry.target.classList.remove('card-visible');
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px 50px 0px',
      }
    );

    const cards = Array.from(
      document.getElementsByClassName('reveal-card')
    ) as HTMLElement[];

    cards.forEach((card) => observer.observe(card));

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
        <p className="eyebrow">Coleccion artesanal</p>

        <h1>Atheliers</h1>

        <div className="line"></div>

        <p className="subtitle">
          Joyeria elegante, minimalista y disenada para destacar cada detalle.
        </p>
      </section>

      <section className="showcase" ref={showcaseRef}>
        <div className="showcaseGrid">
          {galeriaPreview.map((item, index) => (
            <article
              key={item.id}
              className={`featurePanel featurePanel${index + 1}`}
            >
              <img className="featureImage" src={item.imagen} alt={item.titulo} />

              <div className="featureContent">
                <p>{item.categoria}</p>
                <h3>{item.titulo}</h3>
                <span>{item.descripcion}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div
        ref={menuPlaceholderRef}
        className={`menuPlaceholder ${catalogoActivo ? 'catalogoActivo' : ''}`}
        style={{ height: menuFijo ? `${menuHeight}px` : 'auto' }}
      >
        <div
          ref={menuRef}
          className={`menuContenedor ${menuFijo ? 'fijo' : ''} ${
            catalogoActivo ? 'catalogoActivo' : ''
          }`}
        >
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

      <div className={`contentWrapper ${catalogoActivo ? 'catalogoActivo' : ''}`}>
        {cargando ? (
          <div className="estadoVacio">
            <p>Conectando al atelier...</p>
          </div>
        ) : errorCarga ? (
          <div className="estadoVacio">
            <p>No se pudo conectar con el catalogo.</p>
          </div>
        ) : joyasFiltradas.length === 0 ? (
          <div className="estadoVacio">
            <p>Proximamente nuevas piezas en esta coleccion.</p>
          </div>
        ) : (
          <section className="gallery">
            {joyasFiltradas.map((joya, index) => (
              <article
                key={joya.id}
                className="card reveal-card"
                style={{ transitionDelay: `${(index % 4) * 40}ms` }}
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

      <footer className="piePagina">
        <div className="contenidoPie">
          <p>&copy; 2026 Atheliers. Todos los derechos reservados.</p>

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
          background: transparent;
          color: #3a171b;
          padding: 0;
          display: flex;
          flex-direction: column;
          overflow-x: hidden;
        }

        .bgContenedor {
          position: fixed;
          top: 0;
          left: 0;
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
          opacity: 0.04;
          will-change: transform;
        }

        .hero {
          position: relative;
          text-align: center;
          padding: 22vh 20px 8vh;
          max-width: 900px;
          margin: 0 auto;
          z-index: 10;
          will-change: transform, opacity;
          transition: opacity 0.1s ease-out;
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

        .showcase {
          position: relative;
          z-index: 15;
          width: 100%;
          max-width: 1120px;
          max-height: 0;
          margin: 0 auto;
          padding: 0 5%;
          box-sizing: border-box;
          overflow: hidden;
          opacity: 0;
          transform: translateY(42px);
          transition:
            max-height 0.72s cubic-bezier(0.16, 1, 0.3, 1),
            opacity 0.52s ease,
            transform 0.72s cubic-bezier(0.16, 1, 0.3, 1),
            margin 0.72s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: max-height, opacity, transform;
        }

        .showcase.is-visible {
          max-height: 470px;
          opacity: 1;
          transform: translateY(0);
          margin-bottom: 0;
        }

        .showcase.is-hidden-up {
          max-height: 0;
          opacity: 0;
          transform: translateY(-42px);
          margin-bottom: 0;
          pointer-events: none;
        }

        .showcaseGrid {
          display: grid;
          grid-template-columns: 1.18fr 0.82fr;
          grid-template-rows: 215px 215px;
          gap: 18px;
        }

        .showcase .featurePanel {
          position: relative;
          overflow: hidden;
          background: transparent;
          isolation: isolate;
          opacity: 0;
          transform: translateY(48px);
          transition:
            opacity 0.58s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.62s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform, opacity;
        }

        .featurePanel1 {
          grid-row: span 2;
        }

        .featurePanel .featureImage {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          border: none;
          z-index: 1;
          transform: scale(1.04);
          transition: transform 0.62s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .featurePanel .featureContent {
          position: absolute;
          left: clamp(24px, 5vw, 58px);
          bottom: clamp(24px, 4.5vw, 52px);
          z-index: 2;
          max-width: 430px;
          color: #4a1e23;
          text-shadow: 0 14px 38px rgba(252, 250, 248, 0.85);
          opacity: 0;
          transform: translateY(24px);
          transition:
            opacity 0.58s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.62s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .showcase.is-visible .featurePanel {
          opacity: 1;
          transform: translateY(0);
        }

        .showcase.is-visible .featurePanel .featureImage {
          transform: scale(1);
        }

        .showcase.is-visible .featurePanel .featureContent {
          opacity: 1;
          transform: translateY(0);
        }

        .showcase.is-visible .featurePanel1 {
          transition-delay: 0ms;
        }

        .showcase.is-visible .featurePanel2 {
          transition-delay: 80ms;
        }

        .showcase.is-visible .featurePanel3 {
          transition-delay: 150ms;
        }

        .showcase.is-hidden-up .featurePanel {
          opacity: 0;
          transform: translateY(-34px);
          transition:
            opacity 0.38s ease,
            transform 0.42s ease;
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

        .featurePanel:hover .featureImage {
          transform: scale(1.02);
        }

        .menuPlaceholder {
          position: relative;
          width: 100%;
          margin-bottom: 15px;
          z-index: 400;
        }

        .menuContenedor {
          position: relative;
          z-index: 400;
          display: flex;
          justify-content: center;
          width: 100%;
          padding: 10px 5% 0;
          background: transparent;
          box-sizing: border-box;
          opacity: 0;
          transform: translateY(46px);
          transition:
            opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.64s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform, opacity;
        }

        .menuContenedor.catalogoActivo {
          opacity: 1;
          transform: translateY(0);
        }

        .menuContenedor.fijo {
          position: fixed;
          top: 20px;
          left: 0;
          z-index: 1000;
        }

        .menuCategorias {
          display: flex;
          justify-content: center;
          gap: 40px;
          flex-wrap: wrap;
          background: rgba(249, 245, 241, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          padding: 15px 30px;
          border-radius: 50px;
          box-shadow: 0 4px 20px rgba(74, 30, 35, 0.05);
          border: 1px solid rgba(74, 30, 35, 0.05);
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
          transition: all 0.3s ease;
        }

        .btnCategoria:hover {
          color: #4a1e23;
        }

        .btnCategoria.activo {
          color: #4a1e23;
          border-bottom: 1px solid #4a1e23;
        }

        .contentWrapper {
          position: relative;
          background: transparent;
          padding: 0 5% 40px;
          max-width: 1280px;
          width: 100%;
          margin: 0 auto;
          z-index: 20;
          flex-grow: 1;
          box-sizing: border-box;
          opacity: 0;
          transform: translateY(58px);
          transition:
            opacity 0.68s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.72s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform, opacity;
        }

        .contentWrapper.catalogoActivo {
          opacity: 1;
          transform: translateY(0);
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
          gap: 56px 42px;
        }

        .card.reveal-card {
          opacity: 0;
          transform: translateY(34px);
          transition:
            opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.58s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform, opacity;
        }

        .card.reveal-card.card-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .card:hover {
          transform: translateY(-8px);
          transition: transform 0.35s ease;
        }

        .imageBox {
          aspect-ratio: 3 / 4;
          overflow: hidden;
          border-radius: 12px;
          background: #eee8e5;
          box-shadow: 0 4px 15px rgba(74, 30, 35, 0.02);
          transition: box-shadow 0.35s ease;
        }

        .card:hover .imageBox {
          box-shadow: 0 12px 30px rgba(74, 30, 35, 0.06);
        }

        .imageBox img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .card:hover img {
          transform: scale(1.04);
        }

        .info {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 15px;
          padding: 18px 5px 5px;
        }

        h2 {
          margin: 0;
          font-size: 0.82rem;
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 2.2px;
          color: #4a1e23;
        }

        .category {
          margin: 7px 0 0;
          font-size: 0.76rem;
          color: #a28b85;
          font-weight: 300;
        }

        .price {
          margin: 0;
          white-space: nowrap;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.1rem;
          color: #4a1e23;
          font-weight: 500;
        }

        .piePagina {
          position: relative;
          z-index: 20;
          width: 100%;
          box-sizing: border-box;
          border-top: 1px solid rgba(74, 30, 35, 0.08);
          padding: 40px 5% 90px;
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
          gap: 18px;
          font-size: 0.8rem;
          color: #a28b85;
          font-family: 'system-ui', -apple-system, sans-serif;
          text-align: center;
        }

        .contenidoPie p {
          margin: 0;
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
          transition: color 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .redes a:hover {
          color: #4a1e23;
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
          z-index: 100;
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
            padding: 18vh 20px 4vh;
          }

          h1 {
            font-size: clamp(3.5rem, 15vw, 5rem);
          }

          .showcase {
            padding: 0 15px;
          }

          .showcase.is-visible {
            max-height: 1005px;
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

          .menuPlaceholder {
            margin-bottom: 20px;
          }

          .menuContenedor {
            padding: 10px 15px 0;
          }

          .menuContenedor.fijo {
            top: 10px;
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
            padding: 0 15px 40px;
          }

          .gallery {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 20px 15px;
          }

          .info {
            flex-direction: column;
            gap: 8px;
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