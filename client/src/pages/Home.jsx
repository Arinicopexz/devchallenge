// src/pages/Landing.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Sun, Battery, ArrowRight, MessageSquare, ShieldCheck } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 text-center">
          
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-400 ring-1 ring-white/10 hover:ring-white/20">
<Link to="/nosotros" className="font-semibold text-yellow-400 hover:text-yellow-300 transition-colors z-10 relative">
  Leer más <span aria-hidden="true">&rarr;</span>
</Link>            </div>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Energía Solar Inteligente para tu Hogar
          </h1>
          
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Calcula tu consumo, dimensiona tu sistema solar y conéctate con una comunidad experta. 
            La solución definitiva para los cortes de energía.
          </p>

          <div className="mt-10 flex items-center justify-center gap-x-6">
            {/* BOTÓN 1: PROBAR SIMULADOR: LOGIN */}
            <Link
              to="/login"
              className="rounded-md bg-yellow-500 px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-yellow-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400 flex items-center gap-2"
            >
              Probar Simulador <ArrowRight size={16}/>
            </Link>

            {/* BOTÓN 2: VISITAR FORO */}
            <Link
              to="/foro"
              className="text-sm font-semibold leading-6 text-white flex items-center gap-2 hover:text-yellow-400 transition-colors"
            >
              Visita nuestro Foro <MessageSquare size={16}/>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 sm:py-32 bg-[#1e293b]/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-yellow-400">Todo en uno</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Gestiona tu independencia energética
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500">
                    <Sun className="text-gray-900" aria-hidden="true" />
                  </div>
                  Cálculo en Tiempo Real
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-400">
                  Nuestra app se conecta al clima de tu ciudad para decirte exactamente cuánta energía producirás hoy.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <ShieldCheck className="text-white" aria-hidden="true" />
                  </div>
                  Acceso Seguro
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-400">
                  Regístrate para guardar tu historial de consumo y configuraciones de tus dispositivos.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;