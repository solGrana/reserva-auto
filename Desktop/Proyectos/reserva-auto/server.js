const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a Supabase
const supabaseUrl = 'https://dtukbxjnrtmjpiiojsrn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0dWtieGpucnRtanBpaW9qc3JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk2NDM5NTUsImV4cCI6MjA1NTIxOTk1NX0.8cZu1p2eKMl2-GSD7BMfRuk0G9Z-xxzFg-ETmMsZ_qw';
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Obtener todas las reservas
app.get('/reservas', async (req, res) => {
    const { data, error } = await supabase.from('reservas').select('*').order('creado_en', { ascending: false });
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.json(data);
});

// Agregar nueva reserva
app.post('/reservas', async (req, res) => {
    const { usuario, fecha, hora, observaciones } = req.body;
    const { data, error } = await supabase.from('reservas').insert([{ usuario, fecha, hora, observaciones }]);
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.status(201).json(data);
});

// Eliminar reserva
app.delete('/reservas/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('reservas').delete().eq('id', id);
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.sendStatus(204);
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
