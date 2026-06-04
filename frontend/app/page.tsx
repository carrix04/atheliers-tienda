'use client';

import { useEffect, useState } from 'react';

type Joya = {
  id: number;
  nombre: string;
  precio: string | number;
  imagen: string;
  categoria: string;
};

export default function Home() {
  const [joyas, setJoyas] = useState<Joya[]>([]);
  const [filtro, setFiltro] = useState('Todas');

  const categorias = ['Todas', 'Anillos', 'Pulseras', 'Collares'];

  useEffect(() => {
    fetch('https://atheliers-backend.onrender.com/api/joyas/')
      .then((res) => res.json())
      .then((data) => setJoyas(data));
  }, []);

  const joyasFiltradas = filtro === 'Todas'
    ? joyas
    : joyas.filter(joya => 
        joya.categoria.toLowerCase().trim() === filtro.toLowerCase().trim()
      );

  return (
    <main className="page">
      <header className="topHeader">
        <img src="/logo.png" alt="Atheliers Logo" className="logo" />
      </header>

      <section className="hero">
        <p className="eyebrow">Coleccion artesanal</p>
        <h1>Atheliers</h1>
        <div className="line"></div>
        <p className="subtitle">
          Joyeria elegante, minimalista y disenada para destacar cada detalle.
        </p>
      </section>

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

      <section className="gallery">
        {joyasFiltradas.map((joya) => (
          <article key={joya.id} className="card">
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

      <style jsx>{`
        .page {
          position: relative;
          min-height: 100vh;
          background: #fcfaf8;
          padding: 110px 5% 90px;
          color: #3a171b;
        }

        .topHeader {
          position: absolute;
          top: 28px;
          left: 36px;
          z-index: 10;
        }

        .logo {
          width: 82px;
          height: auto;
          object-fit: contain;
          background: transparent;
          box-shadow: none;
          border-radius: 0;
          padding: 0;
          display: block;
        }

        .hero {
          text-align: center;
          margin: 0 auto 50px;
          max-width: 760px;
        }

        .eyebrow {
          margin-bottom: 16px;
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 4px;
          color: #9a6a5e;
          font-weight: 400;
        }

        h1 {
          margin: 0;
          font-family: Georgia, 'Times New Roman', serif;
          font-size: clamp(3.2rem, 8vw, 6.7rem);
          font-weight: 400;
          letter-spacing: -3px;
          color: #4a1e23;
        }

        .line {
          width: 56px;
          height: 1px;
          margin: 24px auto;
          background: #4a1e23;
          opacity: 0.45;
        }

        .subtitle {
          margin: 0 auto;
          max-width: 520px;
          font-size: 1rem;
          line-height: 1.8;
          color: #7b6460;
          font-weight: 300;
        }

        .menuCategorias {
          display: flex;
          justify-content: center;
          gap: 40px;
          margin-bottom: 60px;
          flex-wrap: wrap;
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

        .gallery {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 56px 42px;
          max-width: 1280px;
          margin: 0 auto;
        }

        .card {
          background: transparent;
          border: none;
          box-shadow: none;
          padding: 0;
          border-radius: 0;
          transition: transform 0.35s ease;
        }

        .card:hover {
          transform: translateY(-6px);
        }

        .imageBox {
          aspect-ratio: 3 / 4;
          overflow: hidden;
          border-radius: 10px;
          background: #eee8e5;
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
          gap: 20px;
          padding-top: 18px;
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
          font-family: Georgia, 'Times New Roman', serif;
          font-size: 1rem;
          color: #4a1e23;
          font-weight: 400;
        }

        @media (max-width: 640px) {
          .page {
            padding: 100px 20px 70px;
          }

          .topHeader {
            top: 22px;
            left: 22px;
          }

          .logo {
            width: 64px;
            height: auto;
          }

          .hero {
            margin-bottom: 40px;
          }

          .menuCategorias {
            gap: 20px;
            margin-bottom: 40px;
          }

          .gallery {
            gap: 38px;
          }

          .info {
            padding-top: 16px;
          }
        }
      `}</style>
    </main>
  );
}