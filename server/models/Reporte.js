const mongoose = require('mongoose');

// Esta es la plantilla de lo que vamos a guardar en Mongo
const ReporteSchema = new mongoose.Schema({
    usuario_id: Number,           // El ID del usuario que viene de Postgres
    fecha: { type: Date, default: Date.now }, 
    horas_restantes: Number,      // El resultado de tu cálculo
    aparatos: [String]            // Ej: ["WIFI", "TV"]
});

module.exports = mongoose.model('Reporte', ReporteSchema);