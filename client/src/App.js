import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// --- TUS PÁGINAS ---
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Foro from './pages/Foro';
import Login from './pages/Login';
import Register from './pages/Register';
import Nosotros from './pages/Nosotros'; 

// --- COMPONENTES ---
import Navbar from './components/Navbar'; 
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0f172a]">
        
        {/* Barra de navegación siempre visible */}
        <Navbar />

        <Routes>
          {/* Rutas Principales */}
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/foro" element={<Foro />} />
          
          {/* Rutas de Acceso */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* NUEVA RUTA: MISIÓN Y VISIÓN */}
          <Route path="/nosotros" element={<Nosotros />} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;