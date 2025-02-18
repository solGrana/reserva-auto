require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.static(__dirname));  // Sirve todos los archivos del root (incluyendo css y fonts)

// Configuración de CORS
const corsOptions = {
    origin: '*', // Permite solicitudes desde cualquier origen
    credentials: true, // Permite enviar cookies y credenciales
    optionsSuccessStatus: 200, // Evita problemas con algunos navegadores antiguos
    methods: ['GET', 'POST', 'DELETE'] // Métodos permitidos
};
  
app.use(cors(corsOptions));  // Usa CORS con las opciones configuradas
  
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Obtener todas las reservas
app.get('/reservas', async (req, res) => {
    const { data, error } = await supabase.from('reservas').select('*');
    if (error) {
        console.error('Error al obtener reservas:', error.message);
        return res.status(500).json({ error: error.message });
    }
    res.json(data);
});

// Agregar una nueva reserva
app.post('/reservas', async (req, res) => {
    const { usuario, fecha, hora, observaciones } = req.body;
    console.log("Cuerpo de la solicitud POST:", req.body);

    // Verificar si ya existe una reserva en esa fecha y hora
    const { data: reservasExistentes, error: errorBusqueda } = await supabase
        .from('reservas')
        .select('id')
        .eq('fecha', fecha)
        .eq('hora', hora);

    if (errorBusqueda) {
        console.error('Error al buscar reserva:', errorBusqueda.message);
        return res.status(500).json({ error: 'Error al buscar reserva' });
    }

    if (reservasExistentes.length > 0) {
        return res.status(400).json({ error: 'Ya existe una reserva para esa fecha y hora' });
    }

    // Si no existe, insertar la nueva reserva
    const { data, error } = await supabase.from('reservas').insert([
        { usuario, fecha, hora, observaciones }
    ]);

    if (error) {
        console.error("Error al insertar reserva:", error);
        return res.status(500).json({ error: error.message });
    }

    console.log("Reserva insertada:", data);
    res.status(201).json(data);
});



// Eliminar una reserva
app.delete('/reservas/:id', async (req, res) => {
    const { id } = req.params;

    const { error } = await supabase.from('reservas').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });

    res.json({ message: 'Reserva eliminada' });
});

// Iniciar servidor
app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor ejecutándose en el puerto ${port}`);
});
