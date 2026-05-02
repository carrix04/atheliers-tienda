"use client"
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Home() {
  // 1. Aquí guardaremos las joyas que vengan de tu base de datos
  const [joyas, setJoyas] = useState([]);

  // 2. Esta es la llamada "fetch" que le pide las fotos a Django
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/joyas/")
      .then((res) => res.json())
      .then((data) => setJoyas(data))
      .catch((err) => console.error("Error al cargar:", err));
  }, []);

  return (
    <main className="min-h-screen bg-white text-black flex flex-col items-center p-10 font-sans">
      
      {/* Título animado */}
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-5xl font-extralight tracking-[0.3em] mb-24 mt-10"
      >
        ATHELIERS
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 max-w-6xl w-full">
        
        {/* 3. Aquí creamos las joyas dinámicamente según lo que subas al panel */}
        {joyas.map((joya: any) => (
          <motion.div 
            key={joya.id}
            whileHover={{ y: -10 }}
            className="group cursor-pointer flex flex-col items-center"
          >
            <div className="bg-gray-50 overflow-hidden w-full aspect-[4/5] mb-6">
              {/* Carga la foto real que subiste en Django */}
              <img 
                src={joya.imagen} 
                alt={joya.nombre} 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
            <h2 className="text-sm tracking-[0.2em] uppercase font-light">{joya.nombre}</h2>
            <p className="text-gray-400 text-xs mt-2">${joya.precio} MXN</p>
          </motion.div>
        ))}

      </div>
    </main>
  );
}