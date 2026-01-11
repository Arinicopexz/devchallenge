// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Sun, Battery, Zap, Home, Wifi, CloudOff, DollarSign, Tv, Monitor, Music, Coffee, AlertTriangle } from 'lucide-react';
import ClimaSolar from '../components/ClimaSolar';

// --- CONFIGURACIÓN ---
const PRECIO_KWH = 0.10; 

const COLORS = {
  SOLAR: 'text-yellow-400 border-yellow-400', 
  SOLAR_BG: 'bg-yellow-400/10',
  AHORRO: 'text-green-500 border-green-500',
  AHORRO_BG: 'bg-green-500/10',
  RED: 'text-red-500 border-red-500',
  RED_BG: 'bg-red-500/10',
  OFF: 'text-gray-500 border-gray-700 bg-gray-800'
};

const getIcono = (nombreIcono) => {
  const mapa = {
    Zap: <Zap size={20}/>, Wifi: <Wifi size={20}/>, CloudOff: <CloudOff size={20}/>,
    Sun: <Sun size={20}/>, Home: <Home size={20}/>, Tv: <Tv size={20}/>,
    Monitor: <Monitor size={20}/>, Music: <Music size={20}/>, Coffee: <Coffee size={20}/>
  };
  // Si viene nulo o no existe, devuelve Rayo
  return mapa[nombreIcono] || <Zap size={20}/>;
};

const DashboardSolar = () => {
  // 1. ESTADO INICIAL VACÍO (Esperando a la Base de Datos)
  const [equipos, setEquipos] = useState([]);

  // 2. CARGAR EQUIPOS DESDE EL BACKEND (POSTGRESQL)
  useEffect(() => {
    const cargarEquiposDB = async () => {
        try {
            // A. Pedimos los equipos al servidor
            const response = await fetch('http://localhost:5000/api/equipos');
            const equiposDB = await response.json();

            // B. Recuperamos si estaban encendidos o apagados (Local Storage)
            const guardadosLocal = JSON.parse(localStorage.getItem('solarEquipos')) || [];

            // C. Mezclamos: Datos de DB + Estado ON/OFF Local
            const equiposListos = equiposDB.map((dbItem) => {
                const localItem = guardadosLocal.find(l => l.nombre === dbItem.nombre);
                return {
                    ...dbItem,
                    // Postgres devuelve 'iconname' en minúscula, lo adaptamos
                    iconName: dbItem.iconname || 'Zap', 
                    // Si ya lo tenías encendido, se queda encendido. Si es nuevo, apagado.
                    encendido: localItem ? localItem.encendido : false 
                };
            });

            setEquipos(equiposListos);

        } catch (error) {
            console.error("Error conectando con base de datos:", error);
        }
    };
    cargarEquiposDB();
  }, []);

  const [tipoPanel, setTipoPanel] = useState("MEDIANO"); 
  const [produccionBase, setProduccionBase] = useState(3000); 
  const [produccionReal, setProduccionReal] = useState(3000); 
  const [factorClima, setFactorClima] = useState(1); 
  const [esDeNoche, setEsDeNoche] = useState(false);
  const [bateria, setBateria] = useState(50); 
  const [tipoSistema, setTipoSistema] = useState(3); 
  const [consumoTotal, setConsumoTotal] = useState(0);

  const handleClimaUpdate = (factor, isDay) => {
    setFactorClima(factor);
    setEsDeNoche(isDay === 0);
  };

  useEffect(() => {
    let base = 3000;
    switch(tipoPanel) {
        case "PEQUENO": base = 1000; break;
        case "MEDIANO": base = 3000; break;
        case "GRANDE": base = 6000; break;
        case "INDUSTRIAL": base = 10000; break;
        default: base = 3000;
    }
    setProduccionBase(base);
  }, [tipoPanel]);

  useEffect(() => {
    const real = Math.round(produccionBase * factorClima);
    setProduccionReal(real);
  }, [produccionBase, factorClima]);

  // Efecto IoT Vivo
  useEffect(() => {
    const total = equipos.reduce((acc, item) => {
      if (!item.encendido) return acc;
      const variacion = (Math.random() * 0.1) - 0.05; 
      return acc + (Number(item.watts) * (1 + variacion));
    }, 0);
    setConsumoTotal(Math.round(total));
  }, [equipos]);

  // Guardar estado ON/OFF
  useEffect(() => {
    if(equipos.length > 0) {
        localStorage.setItem('solarEquipos', JSON.stringify(equipos));
    }
  }, [equipos]);

  const simularSistema = () => {
    const balance = produccionReal - consumoTotal; 
    const capacidadBateriaWh = 5000; 
    let energiaBat = (bateria / 100) * capacidadBateriaWh;
    let estado = { mensaje: "", color: COLORS.OFF, bg: 'bg-gray-800' };

    if (tipoSistema === 1) { // ON-GRID
      if (balance >= 0) estado = { mensaje: `Inyectando ${Math.abs(balance).toFixed(0)}W`, color: COLORS.AHORRO, bg: COLORS.AHORRO_BG };
      else estado = { mensaje: `Consumiendo Red`, color: COLORS.RED, bg: COLORS.RED_BG };
    } else if (tipoSistema === 2) { // OFF-GRID
      if (balance >= 0) estado = { mensaje: "Cargando Batería", color: COLORS.SOLAR, bg: COLORS.SOLAR_BG };
      else {
        if (energiaBat > Math.abs(balance)) estado = { mensaje: "Usando Batería", color: COLORS.AHORRO, bg: COLORS.AHORRO_BG };
        else estado = { mensaje: "¡APAGÓN!", color: COLORS.OFF, bg: 'bg-gray-900' };
      }
    } else { // HÍBRIDO
       if (balance >= 0) estado = { mensaje: "Prioridad Carga", color: COLORS.SOLAR, bg: COLORS.SOLAR_BG };
       else {
         if (energiaBat > Math.abs(balance)) estado = { mensaje: "Ahorro Batería", color: COLORS.AHORRO, bg: COLORS.AHORRO_BG };
         else estado = { mensaje: "Usando Red", color: COLORS.RED, bg: COLORS.RED_BG };
       }
    }
    return estado;
  };

  const resultado = simularSistema();
  const ahorroHora = (produccionReal / 1000) * PRECIO_KWH;

  const toggleEquipo = (id) => {
    setEquipos(equipos.map(e => e.id === id ? {...e, encendido: !e.encendido} : e));
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        <ClimaSolar onClimaChange={handleClimaUpdate} />

        {factorClima < 1 && (
            <div className="mb-6 bg-orange-500/10 border border-orange-500/50 p-3 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
                <AlertTriangle className="text-orange-500" />
                <p className="text-sm text-orange-200">
                    <span className="font-bold">Aviso del Sistema:</span> La producción solar está al {Math.round(factorClima * 100)}% debido a las condiciones climáticas actuales.
                </p>
            </div>
        )}

        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 mt-6">
          <h1 className="text-3xl font-bold text-yellow-400 flex items-center gap-3">
            <Sun className="animate-spin-slow" /> Solar IoT Manager
          </h1>
          <div className="bg-green-900/30 border border-green-500/50 px-6 py-2 rounded-full flex items-center gap-3">
            <DollarSign className="text-green-400" size={24} />
            <div>
              <p className="text-xs text-green-300 uppercase tracking-wider">Ahorro Estimado</p>
              <p className="text-xl font-mono font-bold text-white">${ahorroHora.toFixed(3)} <span className="text-sm font-normal text-gray-400">/ hora</span></p>
            </div>
          </div>
        </header>

        {/* SELECTOR SISTEMA */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 bg-gray-900/50 p-2 rounded-xl inline-block w-full">
          {[
            {id: 1, label: "On-Grid (Red)"},
            {id: 2, label: "Off-Grid (Isla)"},
            {id: 3, label: "Híbrido (Smart)"}
          ].map((sys) => (
            <button 
              key={sys.id}
              onClick={() => setTipoSistema(sys.id)}
              className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                tipoSistema === sys.id ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800'
              }`}
            >
              {sys.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* COLUMNA IZQUIERDA: EQUIPOS */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 backdrop-blur-sm">
              <h2 className="text-lg font-semibold mb-4 text-gray-300 flex items-center gap-2">
                <Wifi className="text-blue-400" size={20}/> Dispositivos IoT
              </h2>
              
              {equipos.length === 0 ? (
                  <div className="text-center py-10 text-gray-500 text-sm">
                      Cargando dispositivos...
                  </div>
              ) : (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {equipos.map((equipo) => (
                      <button 
                        key={equipo.id}
                        onClick={() => toggleEquipo(equipo.id)}
                        className={`w-full p-3 rounded-xl flex justify-between items-center transition-all duration-300 border ${
                          equipo.encendido 
                          ? 'border-green-500/50 bg-green-500/10 shadow-[0_0_10px_rgba(34,197,94,0.1)]' 
                          : 'border-gray-700 bg-gray-800/50 hover:bg-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${equipo.encendido ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400'}`}>
                            {getIcono(equipo.iconName)}
                          </div>
                          <span className={`font-medium ${equipo.encendido ? 'text-white' : 'text-gray-400'}`}>
                            {equipo.nombre}
                          </span>
                        </div>
                        <span className={`font-mono text-sm ${equipo.encendido ? 'text-yellow-400' : 'text-gray-600'}`}>
                            {equipo.watts}W
                        </span>
                      </button>
                    ))}
                  </div>
              )}
              
              <div className="mt-6 pt-4 border-t border-gray-700 flex justify-between items-end">
                 <span className="text-gray-400 text-sm">Consumo Total:</span>
                 <span className="text-3xl font-mono font-bold text-red-400">{consumoTotal}<span className="text-lg">W</span></span>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: VISUALIZACIÓN */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className={`flex-1 min-h-[300px] rounded-3xl border-2 relative overflow-hidden flex flex-col justify-center items-center text-center transition-all duration-500 ${resultado.color} ${resultado.bg}`}>
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                 <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full filter blur-3xl ${tipoSistema === 1 ? 'bg-blue-500' : 'bg-yellow-500'}`}></div>
              </div>
              <div className="z-10 bg-black/20 p-8 rounded-full backdrop-blur-md mb-6 border border-white/10 shadow-2xl">
                  {esDeNoche ? <Sun size={64} className="text-gray-600"/> : (tipoSistema === 1 ? <Home size={64}/> : <Zap size={64}/>)}
              </div>
              <h3 className="text-4xl md:text-5xl font-bold uppercase tracking-tight z-10 drop-shadow-lg">
                  {esDeNoche && produccionReal === 0 && bateria < 5 ? "SISTEMA INACTIVO" : resultado.mensaje}
              </h3>
              <div className="flex gap-8 mt-8 z-10">
                <div className="text-center">
                    <p className="text-xs uppercase tracking-widest opacity-70">Producción Real</p>
                    <p className={`text-2xl font-mono font-bold ${produccionReal < produccionBase ? 'text-orange-400' : 'text-yellow-400'}`}>
                        {produccionReal}W
                    </p>
                    {produccionReal < produccionBase && (
                          <p className="text-xs text-gray-500 line-through">Capacidad: {produccionBase}W</p>
                    )}
                </div>
                {tipoSistema !== 1 && (
                    <div className="text-center">
                        <p className="text-xs uppercase tracking-widest opacity-70">Batería</p>
                        <p className={`text-2xl font-mono font-bold ${bateria < 20 ? 'text-red-500' : 'text-green-400'}`}>
                            {bateria.toFixed(0)}%
                        </p>
                    </div>
                )}
              </div>
            </div>

            {/* CONTROLES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="bg-gray-800/50 p-5 rounded-2xl border border-gray-700">
                    <label className="flex justify-between mb-3 text-yellow-400 font-medium">
                        <span className="flex items-center gap-2"><Sun size={18}/> Mi Panel Solar</span>
                    </label>
                    <select 
                        value={tipoPanel}
                        onChange={(e) => setTipoPanel(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-600 text-white rounded-lg p-2 focus:ring-2 focus:ring-yellow-400 outline-none"
                    >
                        <option value="PEQUENO">Pequeño (1000W)</option>
                        <option value="MEDIANO">Mediano (3000W)</option>
                        <option value="GRANDE">Grande (6000W)</option>
                        <option value="INDUSTRIAL">Industrial (10000W)</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-2">
                        {esDeNoche ? "Modo Noche: Producción Solar detenida." : "La producción se ajusta automáticamente al clima."}
                    </p>
                </div>

                {tipoSistema !== 1 && (
                    <div className="bg-gray-800/50 p-5 rounded-2xl border border-gray-700">
                        <label className="flex justify-between mb-3 text-green-400 font-medium">
                            <span className="flex items-center gap-2"><Battery size={18}/> Nivel Batería (Simulado)</span>
                        </label>
                        <input type="range" min="0" max="100" value={bateria} onChange={(e) => setBateria(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"/>
                    </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSolar;