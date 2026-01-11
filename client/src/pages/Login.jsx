// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Sun, ShieldAlert } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  // Si ya hay usuario, ir al dashboard (excepto si queremos entrar como admin)
  useEffect(() => {
    if (localStorage.getItem('usuarioSolar')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        const user = await response.json();
        localStorage.setItem('usuarioSolar', JSON.stringify(user));
        navigate('/dashboard');
      } else {
        alert("Correo o contraseña incorrectos");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // --- NUEVA FUNCIÓN: MODO ADMIN ---
  const accesoAdmin = () => {
    // Pedimos una contraseña simple en una ventana emergente
    const clave = prompt("🔐 Ingrese Clave de Administrador:");
    
    if (clave === "solar123") { // <--- TU CLAVE SECRETA
        // Guardamos un pase temporal
        localStorage.setItem('esAdmin', 'true');
        navigate('/admin');
    } else if (clave !== null) {
        alert("⛔ Clave incorrecta");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 w-full max-w-md shadow-2xl relative">
        <div className="text-center mb-8">
           <Sun className="mx-auto text-yellow-400 mb-2" size={40} />
           <h2 className="text-2xl font-bold text-white">Bienvenido</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-gray-400 text-sm">Correo Electrónico</label>
            <input type="email" onChange={(e) => setFormData({...formData, email: e.target.value})} required className="w-full bg-slate-900 border border-slate-600 rounded p-3 text-white" />
          </div>

          <div>
            <label className="text-gray-400 text-sm">Contraseña</label>
            <input type="password" onChange={(e) => setFormData({...formData, password: e.target.value})} required className="w-full bg-slate-900 border border-slate-600 rounded p-3 text-white" />
          </div>

          <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2">
            <LogIn size={18} /> Ingresar
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400 text-sm">
          ¿No tienes cuenta? <Link to="/register" className="text-blue-400 hover:underline">Regístrate gratis</Link>
        </p>

        {/* --- BOTÓN SECRETO DE ADMIN --- */}
        <div className="mt-8 pt-4 border-t border-slate-700 text-center">
            <button 
                onClick={accesoAdmin}
                className="text-xs text-gray-600 hover:text-red-400 flex items-center justify-center gap-1 mx-auto transition-colors"
            >
                <ShieldAlert size={12}/> Soy Administrador
            </button>
        </div>

      </div>
    </div>
  );
};

export default Login;