require('dotenv').config();
const express = require('express');
const { Pool } = require('pg'); // Postgres
const mongoose = require('mongoose'); // Mongo
const cors = require('cors');

// Modelos de Mongo
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
  respuestas: [RespuestaSchema]
});

const Post = mongoose.model('Post', PostSchema);

const app = express();
app.use(cors());
app.use(express.json());

// ==========================================
// 1. CONEXIÓN A POSTGRESQL (Usuarios)
// ==========================================
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

pool.connect()
    .then(() => console.log('✅ PostgreSQL Conectado (Usuarios)'))
    .catch(err => console.log('⚠️ Error Postgres:', err.message));

// ==========================================
// 2. CONEXIÓN A MONGODB (Foro)
// ==========================================
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/solar_db";
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB Conectado (Foro)'))
    .catch(err => console.error('❌ Error MongoDB:', err));


// ==========================================
//            RUTAS IOT (Cálculo)
// ==========================================
app.post('/api/calculo', (req, res) => {
    try {
        const { tamano_panel, aparatos } = req.body;
        let wattsPanel = 3000;
        if (tamano_panel === "PEQUENO") wattsPanel = 1000;
        if (tamano_panel === "MEDIANO") wattsPanel = 3000;
        if (tamano_panel === "GRANDE") wattsPanel = 6000;
        if (tamano_panel === "INDUSTRIAL") wattsPanel = 10000;

        const CONSUMO_WATTS = { "WIFI": 15, "TV": 120, "LAPTOP": 60, "REFRIGERADORA": 250, "FOCO": 10, "BOMBA_AGUA": 750 };

        let consumoTotal = 0;
        for (const [equipo, cantidad] of Object.entries(aparatos)) {
            if (CONSUMO_WATTS[equipo]) {
                consumoTotal += (CONSUMO_WATTS[equipo] * (parseInt(cantidad) || 0));
            }
        }
        if (consumoTotal === 0) consumoTotal = 1;
        
        const eficiencia = 0.85;
        const capacidadReal = wattsPanel * eficiencia; 
        let horas = (capacidadReal / consumoTotal).toFixed(2);
        
        res.json({ horas, consumoTotal, capacidadReal });
    } catch (error) { res.status(500).json({ error: "Error cálculo" }); }
});

// ==========================================
//       RUTAS USUARIOS (POSTGRESQL)
// ==========================================
app.post('/api/register', async (req, res) => {
    try {
        const { nombre, email, password, panel } = req.body;
        const u = await pool.query(
            "INSERT INTO usuarios (nombre, email, password, panel) VALUES($1, $2, $3, $4) RETURNING *", 
            [nombre, email, password, panel]
        );
        res.json(u.rows[0]);
    } catch(e) { res.status(500).json({error: e.message}) }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const u = await pool.query("SELECT * FROM usuarios WHERE email = $1 AND password = $2", [email, password]);
        if(u.rows.length > 0) {
            res.json(u.rows[0]);
        } else {
            res.status(401).json({error: "Credenciales incorrectas"});
        }
    } catch(e) { res.status(500).json({error: e.message}) }
});

// --- RUTA QUE TE FALTABA: ADMIN ---
app.get('/api/users', async (req, res) => {
    try {
        // Pedimos la lista completa a Postgres
        const result = await pool.query("SELECT id, nombre, email, password, panel FROM usuarios");
        res.json(result.rows);
    } catch (e) { 
        res.status(500).json({error: e.message}); 
    }
});

// ==========================================
//       RUTAS FORO (MONGODB)
// ==========================================
app.get('/api/posts', async (req, res) => { 
    try {
        const posts = await Post.find().sort({ fecha: -1 }); 
        res.json(posts);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.post('/api/posts', async (req, res) => {
    const { titulo, contenido, autor } = req.body;
    const post = new Post({ titulo, contenido, autor: autor || 'Anónimo' });
    try {
        const newPost = await post.save();
        res.status(201).json(newPost);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

// RUTA PARA RESPONDER
app.post('/api/posts/:id/respuestas', async (req, res) => {
    const { id } = req.params;
    const { autor, contenido } = req.body;
    try {
        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ error: "Post no encontrado" });
        post.respuestas.push({ autor, contenido });
        await post.save();
        res.json(post);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// ==========================================

// ... (resto del código anterior) ...

// ==========================================
//   NUEVAS RUTAS DE PODER (DELETE) 🗑️
// ==========================================

// 1. ELIMINAR USUARIO (Postgres)
app.delete('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM usuarios WHERE id = $1", [id]);
        res.json({ message: "Usuario eliminado" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// 2. ELIMINAR POST DEL FORO (Mongo)
app.delete('/api/posts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Post.findByIdAndDelete(id);
        res.json({ message: "Post eliminado" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ==========================================

// ==========================================
//    NUEVO: GESTIÓN DE EQUIPOS (ADMIN) 🛠️
// ==========================================

// 1. CREAR TABLA SI NO EXISTE (Automático)
// Esto se ejecuta una vez al iniciar para asegurar que la tabla existe
pool.query(`
    CREATE TABLE IF NOT EXISTS equipos (
        id SERIAL PRIMARY KEY, 
        nombre TEXT, 
        watts INT, 
        iconname TEXT
    )
`).then(() => {
    // Si la tabla está vacía, insertamos los equipos por defecto
    pool.query("SELECT COUNT(*) FROM equipos").then(res => {
        if (res.rows[0].count === '0') {
            pool.query(`INSERT INTO equipos (nombre, watts, iconname) VALUES 
                ('Refrigeradora', 200, 'Zap'),
                ('Laptop Dev', 65, 'Wifi'),
                ('Aire Acond.', 1500, 'CloudOff'),
                ('Luces Sala', 40, 'Sun')
            `);
            console.log("✅ Equipos por defecto creados");
        }
    });
});

// 2. OBTENER EQUIPOS (Para Dashboard y Admin)
app.get('/api/equipos', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM equipos ORDER BY id ASC");
        res.json(result.rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// 3. AGREGAR EQUIPO (Admin)
app.post('/api/equipos', async (req, res) => {
    const { nombre, watts, iconName } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO equipos (nombre, watts, iconname) VALUES ($1, $2, $3) RETURNING *",
            [nombre, watts, iconName]
        );
        res.json(result.rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// 4. ELIMINAR EQUIPO (Admin)
app.delete('/api/equipos/:id', async (req, res) => {
    try {
        await pool.query("DELETE FROM equipos WHERE id = $1", [req.params.id]);
        res.json({ message: "Eliminado" });
    } catch (e) { res.status(500).json({ error: e.message }); }
});
// app.listen ...
app.listen(5000, () => { 
    console.log('🚀 SERVIDOR SOLAR LISTO EN PUERTO 5000'); 
});