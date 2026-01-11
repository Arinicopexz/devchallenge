const mongoose = require('mongoose');

// Esquema para una respuesta individual
const RespuestaSchema = new mongoose.Schema({
  autor: String,
  contenido: String,
  fecha: { type: Date, default: Date.now }
});

// Esquema del Post principal
const PostSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  contenido: { type: String, required: true },
  autor: { type: String, default: 'Anónimo' }, 
  fecha: { type: Date, default: Date.now },
  respuestas: [RespuestaSchema] 
});

module.exports = mongoose.model('Post', PostSchema);