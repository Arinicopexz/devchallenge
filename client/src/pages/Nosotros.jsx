// src/pages/Nosotros.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb, TrendingUp, ShieldCheck, Sun, ArrowLeft, Zap } from 'lucide-react';

const Nosotros = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-yellow-500 selection:text-black">
      
      {/* NAV SIMPLE */}
      <nav className="p-6 max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={20} /> Volver al Inicio
        </Link>
        <span className="font-bold text-yellow-500 tracking-widest text-sm">SOLAR IOT MANAGER</span>
      </nav>

      <div className="max-w-4xl mx-auto px-6 pb-20">
        
        {/* HERO SECTION */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                No podemos controlar el clima, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                    pero sí nuestra energía.
                </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Transformando la crisis energética de Ecuador en una oportunidad de autonomía, ahorro e innovación tecnológica.
            </p>
        </div>

        {/* EL PROBLEMA */}
        <div className="grid md:grid-cols-2 gap-12 mb-20 items-center">
            <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Zap size={100} />
                </div>
                <h2 className="text-2xl font-bold text-red-400 mb-4 flex items-center gap-2">
                    <ShieldCheck /> El Desafío Actual
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                    Ecuador enfrenta una realidad compleja: la dependencia hidroeléctrica nos ha dejado vulnerables. Los <strong className="text-white">apagones</strong> no son solo momentos de oscuridad; son negocios detenidos, estudiantes sin internet y familias en incertidumbre.
                </p>
                <p className="text-gray-300 leading-relaxed">
                    La red eléctrica tradicional ya no es suficiente. La estabilidad energética se ha convertido en el recurso más valioso del siglo XXI.
                </p>
            </div>
            
            {/* LA VISIÓN / SOLUCIÓN */}
            <div className="space-y-6">
                <div className="flex gap-4">
                    <div className="bg-yellow-500/20 p-3 h-fit rounded-lg text-yellow-400"><Sun size={24}/></div>
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">Autonomía Solar</h3>
                        <p className="text-gray-400 text-sm">Proponemos un cambio de paradigma: descentralizar la energía. Que cada hogar y empresa sea su propia central eléctrica, reduciendo la presión sobre la red nacional.</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="bg-blue-500/20 p-3 h-fit rounded-lg text-blue-400"><TrendingUp size={24}/></div>
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">Inversión Inteligente</h3>
                        <p className="text-gray-400 text-sm">Los paneles solares no son un gasto, son un activo financiero. Con el alza de tarifas y la necesidad de generadores, el sol es la única fuente que no te envía una factura a fin de mes.</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="bg-green-500/20 p-3 h-fit rounded-lg text-green-400"><Lightbulb size={24}/></div>
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">Gestión IoT (Nuestra App)</h3>
                        <p className="text-gray-400 text-sm">De nada sirve tener energía si no sabes cómo la usas. Nuestra plataforma conecta tus dispositivos para optimizar cada Watt generado, priorizando lo esencial cuando más importa.</p>
                    </div>
                </div>
            </div>
        </div>

        {/* CALL TO ACTION */}
        <div className="bg-gradient-to-r from-blue-900 to-slate-900 rounded-3xl p-10 text-center border border-blue-500/30 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
            <h2 className="text-3xl font-bold text-white mb-4 relative z-10">Únete a la Revolución Energética</h2>
            <p className="text-blue-200 mb-8 max-w-xl mx-auto relative z-10">
                Toma el control. Gestiona tus dispositivos, calcula tu ahorro y asegura tu futuro energético hoy mismo.
            </p>
            <Link to="/register" className="relative z-10 inline-block bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 px-8 rounded-full transition-transform hover:scale-105 shadow-lg shadow-yellow-500/20">
                Comenzar Ahora
            </Link>
        </div>

      </div>
    </div>
  );
};

export default Nosotros;