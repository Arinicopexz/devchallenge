// src/pages/Admin.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, LogOut, Trash2, Zap, Plus, Users, MessageSquare } from 'lucide-react';

const Admin = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [posts, setPosts] = useState([]); //  ESTADO PARA POSTS
  const [nuevoEquipo, setNuevoEquipo] = useState({ nombre: '', watts: '', iconName: 'Zap' });
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('esAdmin') !== 'true') navigate('/dashboard'); 
    fetchData();
  }, [navigate]);

  const fetchData = () => {
      fetchUsers(); 
      fetchEquipos();
      fetchPosts(); // CARGAMOS POSTS AL INICIO
  };

  const fetchUsers = async () => { try { const res = await fetch('http://localhost:5000/api/users'); setUsuarios(await res.json()); } catch (e) {} };
  const fetchEquipos = async () => { try { const res = await fetch('http://localhost:5000/api/equipos'); setEquipos(await res.json()); } catch (e) {} };
  
  // NUEVA FUNCIÓN: TRAER POSTS
  const fetchPosts = async () => { try { const res = await fetch('http://localhost:5000/api/posts'); setPosts(await res.json()); } catch (e) {} };

  const agregarEquipo = async (e) => {
      e.preventDefault();
      if (!nuevoEquipo.nombre || !nuevoEquipo.watts) return;
      await fetch('http://localhost:5000/api/equipos', {
          method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(nuevoEquipo)
      });
      fetchEquipos();
      setNuevoEquipo({ nombre: '', watts: '', iconName: 'Zap' });
  };

  const eliminarEquipo = async (id) => { if (window.confirm("¿Borrar equipo?")) { await fetch(`http://localhost:5000/api/equipos/${id}`, { method: 'DELETE' }); fetchEquipos(); } };
  const eliminarUsuario = async (id) => { if (window.confirm("¿Eliminar usuario?")) { await fetch(`http://localhost:5000/api/users/${id}`, { method: 'DELETE' }); fetchUsers(); } };
  
  // NUEVA FUNCIÓN: BORRAR POST
  const eliminarPost = async (id) => { if (window.confirm("¿CENSURAR POST DEL FORO?")) { await fetch(`http://localhost:5000/api/posts/${id}`, { method: 'DELETE' }); fetchPosts(); } };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-4 font-sans text-xs flex flex-col">
      <div className="max-w-7xl mx-auto w-full h-[90vh] flex flex-col gap-4">
        
        {/* HEADER */}
        <div className="flex items-center justify-between bg-slate-900 px-4 py-2 rounded border border-slate-700 shrink-0">
            <div className="flex items-center gap-2 text-yellow-500 font-bold">
                <ShieldCheck size={16} /> ADMIN PANEL
            </div>
            <button onClick={() => { localStorage.removeItem('esAdmin'); navigate('/login'); }} className="text-gray-400 hover:text-red-400 flex items-center gap-1 transition-colors">
                <LogOut size={14}/> Salir
            </button>
        </div>

        {/* AHORA USAMOS 3 COLUMNAS: IOT | USUARIOS | FORO */}
        <div className="grid lg:grid-cols-3 gap-4 h-full overflow-hidden">
            
            {/* === COLUMNA 1: EQUIPOS === */}
            <div className="bg-slate-800 border border-slate-700 flex flex-col rounded overflow-hidden">
                <div className="bg-slate-950 px-3 py-2 border-b border-slate-700 font-bold text-yellow-500 flex justify-between">
                    <span>CATÁLOGO IOT</span> <span>{equipos.length}</span>
                </div>
                <form onSubmit={agregarEquipo} className="flex flex-row items-center gap-2 p-2 bg-slate-900 border-b border-slate-700">
                    <input placeholder="Nombre" value={nuevoEquipo.nombre} onChange={e=>setNuevoEquipo({...nuevoEquipo, nombre: e.target.value})} className="flex-1 bg-slate-800 border border-slate-600 rounded px-2 h-8 text-white focus:border-yellow-500 outline-none min-w-0" />
                    <input type="number" placeholder="W" value={nuevoEquipo.watts} onChange={e=>setNuevoEquipo({...nuevoEquipo, watts: e.target.value})} className="w-12 bg-slate-800 border border-slate-600 rounded px-1 h-8 text-center text-white focus:border-yellow-500 outline-none" />
                    <select value={nuevoEquipo.iconName} onChange={e=>setNuevoEquipo({...nuevoEquipo, iconName: e.target.value})} className="w-16 bg-slate-800 border border-slate-600 rounded px-1 h-8 text-white outline-none cursor-pointer">
                        <option value="Zap">⚡</option><option value="Wifi">📶</option><option value="Tv">📺</option><option value="Sun">☀️</option><option value="Music">🎵</option><option value="Monitor">🖥️</option>
                    </select>
                    <button type="submit" className="bg-yellow-600 hover:bg-yellow-500 text-white w-8 h-8 rounded flex items-center justify-center shrink-0 transition-colors"><Plus size={16}/></button>
                </form>
                <div className="overflow-y-auto flex-1 bg-slate-900 custom-scrollbar p-2 space-y-1">
                    {equipos.map(e => (
                        <div key={e.id} className="flex items-center justify-between bg-slate-800 p-2 rounded border border-slate-700/50 hover:border-yellow-500/50 transition-colors">
                            <div className="flex items-center gap-2 min-w-0">
                                <span className="text-yellow-500"><Zap size={12}/></span>
                                <div className="min-w-0 leading-tight">
                                    <p className="font-bold text-gray-200 truncate">{e.nombre}</p>
                                    <p className="text-[10px] text-gray-500 font-mono">{e.watts}W</p>
                                </div>
                            </div>
                            <button onClick={() => eliminarEquipo(e.id)} className="w-6 h-6 flex items-center justify-center bg-slate-900 text-gray-600 hover:text-red-500 rounded shrink-0 transition-colors"><Trash2 size={12}/></button>
                        </div>
                    ))}
                </div>
            </div>

            {/* === COLUMNA 2: USUARIOS === */}
            <div className="bg-slate-800 border border-slate-700 flex flex-col rounded overflow-hidden">
                <div className="bg-slate-950 px-3 py-2 border-b border-slate-700 font-bold text-blue-400 flex justify-between">
                    <span>USUARIOS</span> <span>{usuarios.length}</span>
                </div>
                <div className="overflow-y-auto flex-1 bg-slate-900 custom-scrollbar p-2 space-y-1">
                    {usuarios.map(u => (
                         <div key={u.id} className="flex items-center justify-between bg-slate-800 p-2 rounded border border-slate-700/50 hover:border-blue-500/50 transition-colors">
                            <div className="flex items-center gap-2 min-w-0">
                                <span className="text-blue-400"><Users size={12}/></span>
                                <div className="min-w-0 leading-tight">
                                    <p className="font-bold text-gray-200 truncate">{u.nombre}</p>
                                    <p className="text-[10px] text-gray-500 truncate">{u.email}</p>
                                </div>
                            </div>
                            <button onClick={() => eliminarUsuario(u.id)} className="w-6 h-6 flex items-center justify-center bg-slate-900 text-gray-600 hover:text-red-500 rounded shrink-0 transition-colors"><Trash2 size={12}/></button>
                        </div>
                    ))}
                </div>
            </div>

            {/* === COLUMNA 3: MODERACIÓN FORO (NUEVO) === */}
            <div className="bg-slate-800 border border-slate-700 flex flex-col rounded overflow-hidden">
                <div className="bg-slate-950 px-3 py-2 border-b border-slate-700 font-bold text-purple-400 flex justify-between">
                    <span>MODERACIÓN FORO</span> <span>{posts.length}</span>
                </div>
                <div className="overflow-y-auto flex-1 bg-slate-900 custom-scrollbar p-2 space-y-1">
                    {posts.length === 0 ? <p className="text-center text-gray-600 pt-10">Sin posts</p> : 
                     posts.map(p => (
                         <div key={p._id} className="flex items-start justify-between bg-slate-800 p-2 rounded border border-slate-700/50 hover:border-purple-500/50 transition-colors group">
                            <div className="flex gap-2 min-w-0">
                                <span className="text-purple-400 mt-0.5"><MessageSquare size={12}/></span>
                                <div className="min-w-0 leading-tight">
                                    <p className="font-bold text-gray-200 truncate text-[11px]">{p.titulo}</p>
                                    <p className="text-[10px] text-gray-400 truncate">Por: {p.autor}</p>
                                    <p className="text-[9px] text-gray-600 truncate italic">"{p.contenido.substring(0,25)}..."</p>
                                </div>
                            </div>
                            {/* BOTÓN DE CENSURA */}
                            <button onClick={() => eliminarPost(p._id)} className="w-6 h-6 flex items-center justify-center bg-slate-900 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded shrink-0 transition-colors" title="Censurar Post">
                                <Trash2 size={12}/>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default Admin;