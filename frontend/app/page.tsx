'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [joyas, setJoyas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/joyas/')
      .then((res) => res.json())
      .then((data) => {
        setJoyas(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar:", err);
        setLoading(false);
      });
  }, []);

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Atheliers Store</h1>
      
      {loading ? (
        <p>Cargando catalogo...</p>
      ) : (
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '20px' }}>
          {joyas.map((joya) => (
            <div key={joya.id} style={{ border: '1px solid #eaeaea', padding: '1rem', borderRadius: '8px', width: '250px' }}>
              {joya.imagen && (
                <img 
                  src={joya.imagen} 
                  alt={joya.nombre} 
                  style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }} 
                />
              )}
              <h2 style={{ fontSize: '1.2rem', margin: '10px 0' }}>{joya.nombre}</h2>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>{joya.descripcion}</p>
              <p style={{ fontWeight: 'bold', marginTop: '10px' }}>${joya.precio}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}