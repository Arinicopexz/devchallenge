// src/components/ClimaSolar.jsx
import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Thermometer, Moon } from 'lucide-react';

// Recibimos la función "onClimaChange" desde el padre
const ClimaSolar = ({ onClimaChange }) => {
  const [clima, setClima] = useState(null);
  const [loading, setLoading] = useState(true);

  // Coordenadas Quito
  const LAT = -0.1807; 
  const LON = -78.4678;

  useEffect(() => {
    const fetchClima = async () => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current_weather=true`
        );
        const data = await response.json();
        setClima(data.current_weather);
        
        // --- LÓGICA DE PRODUCCIÓN REAL ---
        // is_day: 1 (Día), 0 (Noche)
        // weathercode: Códigos de clima (0=Despejado, >60=Lluvia)
        let factor = 1.0; // 100% por defecto
        if (data.current_weather.is_day === 0) {
            factor = 0; // Es de noche, producción 0
        } else if (data.current_weather.weathercode >= 60) {
            factor = 0.2; // Lluvia fuerte, producción 20%
        } else if (data.current_weather.weathercode > 3) {
            factor = 0.6; // Nublado, producción 60%
        }

        // Enviamos el factor al Dashboard
        if (onClimaChange) onClimaChange(factor, data.current_weather.is_day);
        
        setLoading(false);
      } catch (error) {
        console.error("Error API Clima:", error);
        setLoading(false);
      }
    };

    fetchClima();
  }, [onClimaChange]); // Se ejecuta al cargar

  const getIcono = (codigo, esDia) => {
    if (esDia === 0) return <Moon size={40} className="text-slate-400" />;
    if (codigo <= 3) return <Sun size={40} className="text-yellow-400 animate-pulse" />;
    if (codigo <= 48) return <Cloud size={40} className="text-gray-400" />;
    return <CloudRain size={40} className="text-blue-400" />;
  };

  if (loading) return <div className="text-white p-4 animate-pulse">Sincronizando satélite...</div>;

  return (
    <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-lg mb-6 flex items-center justify-between">
      <div>
        <h2 className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
           <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
           Condiciones en Tiempo Real (Quito)
        </h2>
        <div className="flex items-center gap-4">
            <span className="text-4xl font-bold text-white flex items-center gap-2">
                <Thermometer size={30} className="text-red-400"/> 
                {clima?.temperature}°C
            </span>
            <div className="text-left hidden md:block">
                <p className="text-blue-300 font-medium">Viento: {clima?.windspeed} km/h</p>
                <p className="text-slate-400 text-xs mt-1">
                    {clima?.is_day === 0 ? "Modo Nocturno Activo" : "Modo Diurno Activo"}
                </p>
            </div>
        </div>
      </div>
      <div className="bg-slate-700/50 p-4 rounded-full border border-slate-600">
        {clima && getIcono(clima.weathercode, clima.is_day)}
      </div>
    </div>
  );
};

export default ClimaSolar;