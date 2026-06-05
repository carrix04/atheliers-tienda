'use client';

import { useEffect, useState, useRef } from 'react';

type Joya = {
  id: number;
  nombre: string;
  precio: string | number;
  imagen: string;
  categoria: string;
};

export default function Home() {
  const [joyas, setJoyas] = useState<Joya[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState('Todas');
  const bgWatermarkRef = useRef<HTMLImageElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  const categorias = ['Todas', 'Anillos', 'Pulseras', 'Collares'];

  useEffect(() => {
    fetch('https://atheliers-backend.onrender.com/api/joyas/', {
      cache: 'no-store',
    })
      .then((res) => res.json())
      .then((data) => {
        setJoyas(data);
        setCargando(false);
      })
      .catch((err) => {
        console.error(err);
        setCargando(false);
      });

    const handleScroll = () => {
      const scroll = window.scrollY;

      if (bgWatermarkRef.current) {
        bgWatermarkRef.current.style.transform = `translate(-50%, calc(-50% + ${
          scroll * 0.1
        }px))`;
      }

      if (heroRef.current) {
        heroRef.current.style.transform = `translateY(${scroll * 0.3}px)`;
        heroRef.current.style.opacity = `${1 - scroll / 400}`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const joyasFiltradas =
    filtro === 'Todas'
      ? joyas
      : joyas.filter(
          (joya) =>
            joya.categoria.toLowerCase().trim() ===
            filtro.toLowerCase().trim()
        );

  const handleInstagramClick = () => {
    window.open('https://ig.me/m/cn.atheliers', '_blank');
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

      <div className="contentWrapper">
        <div className="menuContenedor">
          <nav className="menuCategorias">
            {categorias.map((cat) => (
              <button
                key={cat}
                className={`btnCategoria ${filtro === cat ? 'activo' : ''}`}
                onClick={() => setFiltro(cat)}
              >
                {cat}
              </button>
            ))}
          </nav>
        </div>

        {cargando ? (
          <div className="estadoVacio">
            <p>Conectando al atelier...</p>
          </div>
        ) : joyasFiltradas.length === 0 ? (
          <div className="estadoVacio">
            <p>Proximamente nuevas piezas en esta coleccion.</p>
          </div>
        ) : (
          <section className="gallery">
            {joyasFiltradas.map((joya) => (
              <article key={joya.id} className="card animacionFade">
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
        aria-label="Enviar mensaje por Instagram"
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
          padding: 22vh 20px 10vh;
          max-width: 900px;
          margin: 0 auto;
          z-index: 10;
          will-change: transform, opacity;
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

        .contentWrapper {
          position: relative;
          background: transparent;
          padding: 0 5% 40px;
          max-width: 1280px;
          margin: 0 auto;
          z-index: 20;
          flex-grow: 1;
        }

        .menuContenedor {
          position: sticky;
          top: 20px;
          z-index: 90;
          display: flex;
          justify-content: center;
          margin-bottom: 60px;
          padding-top: 10px;
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

        .card {
          background: transparent;
          padding: 0;
          border-radius: 0;
          box-shadow: none;
          transition: all 0.35s ease;
        }

        .animacionFade {
          animation: fadeSutil 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }

        @keyframes fadeSutil {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }

          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .card:hover {
          transform: translateY(-8px);
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
            padding: 18vh 20px 8vh;
          }

          h1 {
            font-size: clamp(3.5rem, 15vw, 5rem);
          }

          .menuContenedor {
            top: 10px;
            margin-bottom: 40px;
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