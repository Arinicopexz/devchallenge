const mongoose = require('mongoose');

// Definimos cómo se ve una respuesta
const RespuestaSchema = new mongoose.Schema({
  autor: String,
  contenido: String,
  fecha: { type: Date, default: Date.now }
});

const PostSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  contenido: { type: String, required: true },
  autor: { type: String, default: 'Anónimo' },
  fecha: { type: Date, default: Date.now },
  // AQUÍ AGREGAMOS LA LISTA DE RESPUESTAS
  respuestas: [RespuestaSchema] 
});

module.exports = mongoose.model('Post', PostSchema);
