// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Sun } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    panel: 'MEDIANO'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        alert("¡Registro exitoso! Ahora inicia sesión.");
        navigate('/login'); // Redirige al login
      } else {
        alert("Error al registrarse. Intenta con otro correo.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
           <Sun className="mx-auto text-yellow-400 mb-2" size={40} />
           <h2 className="text-2xl font-bold text-white">Crea tu cuenta Solar</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm">Nombre Completo</label>
            <input name="nombre" onChange={handleChange} required className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white" />
          </div>
          
          <div>
            <label className="text-gray-400 text-sm">Correo Electrónico</label>
            <input type="email" name="email" onChange={handleChange} required className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white" />
          </div>

          <div>
            <label className="text-gray-400 text-sm">Contraseña</label>
            <input type="password" name="password" onChange={handleChange} required className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white" />
          </div>

          <div>
            <label className="text-gray-400 text-sm">Tipo de Panel (Inicial)</label>
            <select name="panel" onChange={handleChange} className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white">
              <option value="PEQUENO">Pequeño (1000W)</option>
              <option value="MEDIANO">Mediano (3000W)</option>
              <option value="GRANDE">Grande (6000W)</option>
            </select>
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2">
            <UserPlus size={18} /> Registrarse
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400 text-sm">
          ¿Ya tienes cuenta? <Link to="/login" className="text-yellow-400 hover:underline">Inicia Sesión aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;