// src/pages/Foro.jsx
import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Clock, Sparkles, MessageCircle, CornerDownRight } from 'lucide-react';

const Foro = () => {
  const [posts, setPosts] = useState([]);
  const [nuevoTitulo, setNuevoTitulo] = useState("");
  const [nuevoContenido, setNuevoContenido] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [loading, setLoading] = useState(true);
  const [responderId, setResponderId] = useState(null);
  const [textoRespuesta, setTextoRespuesta] = useState("");
  const [enviandoRespuesta, setEnviandoRespuesta] = useState(false);

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/posts');
      const data = await response.json();
      setPosts(data);
      setLoading(false);
    } catch (error) { console.error("Error cargando foro:", error); setLoading(false); }
  };

  const getUsuarioActual = () => {
    const u = JSON.parse(localStorage.getItem('usuarioSolar'));
    return u ? u.nombre : "Anónimo";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nuevoTitulo.trim() || !nuevoContenido.trim()) return;
    setEnviando(true);
    try {
      const response = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo: nuevoTitulo, contenido: nuevoContenido, autor: getUsuarioActual() })
      });
      if (response.ok) { await fetchPosts(); setNuevoTitulo(""); setNuevoContenido(""); }
    } catch (error) { console.error(error); } finally { setEnviando(false); }
  };

  const enviarRespuesta = async (postId) => {
    if (!textoRespuesta.trim()) { alert("Escribe algo antes de enviar."); return; }
    setEnviandoRespuesta(true);
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${postId}/respuestas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ autor: getUsuarioActual(), contenido: textoRespuesta })
      });
      if (response.ok) { await fetchPosts(); setResponderId(null); setTextoRespuesta(""); }
    } catch (error) { console.error(error); } finally { setEnviandoRespuesta(false); }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600/20 rounded-xl border border-blue-500/30">
              <MessageSquare className="text-blue-400" size={28} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">Comunidad Solar</h1>
              <p className="text-sm md:text-base text-gray-400">Comparte conocimiento.</p>
            </div>
          </div>
          <div className="bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700 flex items-center gap-2">
            <Sparkles size={16} className="text-yellow-400" />
            <span className="text-xs font-medium text-gray-300">{posts.length} Temas Activos</span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
          <div className="h-fit lg:sticky lg:top-24">
            <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700 p-5 rounded-xl shadow-lg">
              <h2 className="text-base font-bold text-blue-400 mb-4 flex items-center gap-2 border-b border-slate-700 pb-2">
                <Send size={16} /> Crear Nuevo Tema
              </h2>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input type="text" value={nuevoTitulo} onChange={(e) => setNuevoTitulo(e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-sm text-white focus:border-blue-500 outline-none placeholder-gray-500" placeholder="Título corto..." maxLength={60}/>
                <textarea value={nuevoContenido} onChange={(e) => setNuevoContenido(e.target.value)} rows="6" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-sm text-white focus:border-blue-500 outline-none resize-none placeholder-gray-500" placeholder="Describe tu caso..."/>
                <button type="submit" disabled={enviando} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all text-sm">
                   {enviando ? "Publicando..." : "Publicar"}
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            {loading ? <p className="text-center text-gray-500 animate-pulse">Cargando discusiones...</p> : 
             posts.length === 0 ? <p className="text-center text-gray-500">Aún no hay mensajes.</p> : 
             posts.map((post) => (
                <div key={post._id} className="bg-slate-800 border border-slate-700 p-5 rounded-xl shadow-md hover:border-slate-600 transition-colors">
                  
                  <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-700/50">
                     <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-md">
                        {post.autor?.charAt(0).toUpperCase()}
                     </div>
                     <div className="flex flex-col">
                        <span className="text-sm font-bold text-white">{post.autor}</span>
                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                           <Clock size={10} /> {new Date(post.fecha).toLocaleDateString()}
                        </span>
                     </div>
                  </div>

                  <h3 className="text-lg font-bold text-yellow-500 mb-2">{post.titulo}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line mb-4">{post.contenido}</p>
                  
                  <div className="flex justify-end items-center gap-3 pt-3 border-t border-slate-700/30">
                    <button 
                        onClick={() => setResponderId(responderId === post._id ? null : post._id)}
                        className={`text-xs px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors ${
                            responderId === post._id ? 'bg-slate-700 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'
                        }`}
                    >
                        <MessageCircle size={14} /> {responderId === post._id ? "Cancelar" : "Responder"}
                    </button>
                  </div>

                  {responderId === post._id && (
                      <div className="mt-4 bg-slate-900/50 p-4 rounded-lg border border-slate-700 animate-in fade-in zoom-in duration-200">
                          <label className="text-xs text-gray-400 mb-1 block">Tu Respuesta:</label>
                          <textarea autoFocus className="w-full bg-slate-800 border border-slate-600 rounded-md p-3 text-sm text-white focus:border-green-500 outline-none resize-none mb-2" rows="4" placeholder="Escribe tu solución..." value={textoRespuesta} onChange={(e) => setTextoRespuesta(e.target.value)} />
                          <button onClick={() => enviarRespuesta(post._id)} disabled={enviandoRespuesta} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2">
                             <Send size={14} /> {enviandoRespuesta ? "Enviando..." : "Enviar Respuesta"}
                          </button>
                      </div>
                  )}

                  {post.respuestas && post.respuestas.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-700 space-y-3">
                          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Respuestas ({post.respuestas.length})</h4>
                          {post.respuestas.map((resp, idx) => (
                              <div key={idx} className="flex gap-3 pl-2">
                                  <CornerDownRight size={16} className="text-gray-600 mt-1 shrink-0" />
                                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 w-full">
                                      <div className="flex justify-between items-center mb-1">
                                          <span className="text-xs font-bold text-blue-300">{resp.autor}</span>
                                          <span className="text-[10px] text-gray-600">{new Date(resp.fecha).toLocaleDateString()}</span>
                                      </div>
                                      <p className="text-xs md:text-sm text-gray-300">{resp.contenido}</p>
                                  </div>
                              </div>
                          ))}
                      </div>
                  )}
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Foro;