const apiUrl = 'https://reserva-auto.onrender.com/reservas'; 

document.addEventListener("DOMContentLoaded", function () {
    const usuarioSelect = document.getElementById("usuario");
    const fechaInput = document.getElementById("fecha");
    const horaSelect = document.getElementById("hora");
    const observacionesInput = document.getElementById("observaciones");
    const listaReservas = document.getElementById("listaReservas");
    const reservarBtn = document.getElementById("reservarBtn");
    const calendarioDiv = document.getElementById("calendario");

    async function cargarReservas() {
        const response = await fetch(apiUrl);
        const reservas = await response.json();
        mostrarReservas(reservas);
    }

    async function agregarReserva() {
        const usuario = usuarioSelect.value;
        const fecha = fechaInput.value;
        const hora = horaSelect.value;
        const observaciones = observacionesInput.value;

        if (!fecha) {
            alert("Selecciona una fecha");
            return;
        }

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario, fecha, hora, observaciones })
        });

        if (response.ok) {
            alert("Reserva agregada");
            cargarReservas();
        } else {
            alert("Error al agregar reserva");
        }
    }

    async function eliminarReserva(id) {
        await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
        cargarReservas();
    }

    function mostrarReservas(reservas) {
        listaReservas.innerHTML = "";
        reservas.forEach(res => {
            const div = document.createElement("div");
            div.className = "reserva";
            div.innerHTML = `
                <div class="reserva-info">
                    <b>${res.usuario}</b> - ${res.fecha} - ${res.hora}
                    <p>Obs: ${res.observaciones || 'Sin observaciones'}</p>
                </div>
                <button class="cancelar" onclick="eliminarReserva('${res.id}')">Cancelar</button>
            `;
            listaReservas.appendChild(div);
        });
    }

    reservarBtn.addEventListener("click", agregarReserva);
    cargarReservas();
});
