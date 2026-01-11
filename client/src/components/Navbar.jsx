// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sun, LogOut, User, LayoutDashboard, MessageSquare } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  
  // 1. LEEMOS SI HAY ALGUIEN LOGUEADO
  // localStorage guarda texto, así que usamos JSON.parse para convertirlo a objeto
  const usuarioGuardado = localStorage.getItem('usuarioSolar');
  const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;

  // 2. FUNCIÓN PARA CERRAR SESIÓN
  const handleLogout = () => {
    // Borramos los datos del navegador
    localStorage.removeItem('usuarioSolar');
    // Forzamos una recarga para limpiar estados y vamos al inicio
    window.location.href = '/'; 
  };

  return (
    <nav className="bg-slate-900/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white hover:text-yellow-400 transition-colors">
          <Sun className="text-yellow-400 animate-spin-slow" />
          <span>Solar<span className="text-yellow-400">EC</span></span>
        </Link>

        {/* MENÚ */}
        <div className="flex items-center gap-6">
          
          {/* Enlaces siempre visibles */}
          <Link to="/foro" className="text-gray-300 hover:text-white flex items-center gap-1 text-sm font-medium">
            <MessageSquare size={16}/> Foro
          </Link>

          {/* LÓGICA CONDICIONAL */}
          {usuario ? (
            // --- OPCIÓN A: SI EL USUARIO ESTÁ LOGUEADO ---
            <>
              <Link to="/dashboard" className="text-yellow-400 hover:text-yellow-300 flex items-center gap-1 text-sm font-medium">
                <LayoutDashboard size={16}/> Mi Panel
              </Link>
              
              <div className="flex items-center gap-3 pl-4 border-l border-gray-700">
                <span className="text-gray-400 text-sm hidden sm:block">
                    Hola, {usuario.nombre || "Usuario"}
                </span>
                <button 
                  onClick={handleLogout}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/50 px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm transition-all"
                >
                  <LogOut size={16} /> Salir
                </button>
              </div>
            </>
          ) : (
            // --- OPCIÓN B: SI NADIE ESTÁ LOGUEADO ---
            <Link 
              to="/login" 
              className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-transform active:scale-95"
            >
              <User size={16} /> Ingresar
            </Link>
          )}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;