"use client"
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function EditorPage() {
  const [joyas, setJoyas] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");

  const cargarJoyas = () => {
    fetch("http://127.0.0.1:8000/api/joyas/")
      .then(res => res.json())
      .then(data => setJoyas(data));
  };

  useEffect(() => { if(isLoggedIn) cargarJoyas(); }, [isLoggedIn]);

  // 🔥 SUPERPODER 1: Actualizar la base de datos
  const handleActualizar = async (id: number) => {
    const nuevoNombre = (document.getElementById(`nombre-${id}`) as HTMLInputElement).value;
    const nuevoPrecio = (document.getElementById(`precio-${id}`) as HTMLInputElement).value;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/joyas/${id}/`, {
        method: "PATCH", // PATCH significa "modificar"
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nuevoNombre, precio: nuevoPrecio })
      });
      if(res.ok) alert("¡Joya actualizada con éxito! 💎");
    } catch (error) {
      alert("Hubo un error al conectar con la base de datos.");
    }
  };

  // 🔥 SUPERPODER 2: Eliminar de la base de datos
  const handleEliminar = async (id: number) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta joya de la tienda?")) return;

    try {
      await fetch(`http://127.0.0.1:8000/api/joyas/${id}/`, { method: "DELETE" });
      cargarJoyas(); // Recargamos la lista para que la joya desaparezca visualmente
    } catch (error) {
      console.error(error);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <h1 className="mb-8 tracking-widest uppercase font-light">Acceso Admin ATHELIERS</h1>
        <input 
          type="password" 
          placeholder="Contraseña"
          className="bg-transparent border-b border-white p-2 text-center outline-none"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button 
          onClick={() => password === "admin123" ? setIsLoggedIn(true) : alert("Incorrecto")}
          className="mt-6 border border-white px-8 py-2 hover:bg-white hover:text-black transition"
        >
          Entrar
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white p-10 font-sans text-black">
      <div className="flex justify-between items-center mb-20">
        <h1 className="text-2xl font-extralight tracking-[0.3em]">EDITOR DE TIENDA</h1>
        {/* Atajo de Ingeniero: Este botón te lleva directo a Django para subir fotos seguras */}
        <a href="http://127.0.0.1:8000/admin/catalog/joya/add/" target="_blank" className="bg-black text-white px-6 py-2 text-xs uppercase tracking-widest hover:bg-gray-800 transition">
          + Nueva Joya
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
        {joyas.map((joya: any) => (
          <div key={joya.id} className="relative group border p-4">
            <div className="aspect-[4/5] bg-gray-50 mb-4 overflow-hidden">
                <img src={joya.imagen} className="w-full h-full object-cover" />
            </div>
            
            {/* Los inputs ahora tienen un ID para que podamos leerlos */}
            <input 
                id={`nombre-${joya.id}`}
                defaultValue={joya.nombre} 
                className="w-full text-sm uppercase tracking-widest mb-2 border-b border-transparent focus:border-gray-300 outline-none"
            />
            <input 
                id={`precio-${joya.id}`}
                defaultValue={joya.precio} 
                className="w-full text-xs text-gray-500 mb-4 outline-none"
            />

            <div className="flex gap-4">
                <button onClick={() => handleActualizar(joya.id)} className="text-[10px] uppercase tracking-tighter text-blue-600 hover:text-blue-800">Actualizar</button>
                <button onClick={() => handleEliminar(joya.id)} className="text-[10px] uppercase tracking-tighter text-red-600 hover:text-red-800">Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}