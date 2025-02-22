document.addEventListener("DOMContentLoaded", async function () {
    // Elementos del DOM
    const usuarioSelect = document.getElementById("usuario");
    const fechaInput = document.getElementById("fecha");
    const horaSelect = document.getElementById("hora");
    const observacionesInput = document.getElementById("observaciones");
    const listaReservas = document.getElementById("listaReservas");
    const calendarioDiv = document.getElementById("calendario");
    const reservarBtn = document.getElementById("reservarBtn");

    /* const apiUrl = 'http://localhost:3000/reservas'; */
    const apiUrl = 'https://reservas-auto.onrender.com/reservas'; 


    let reservas = [];

    // Definir los colores para cada usuario
    const coloresUsuarios = {
        "Sol": "rgba(138, 43, 226, 0.2)",    // Violeta transparente
        "Pau": "rgba(255, 105, 180, 0.2)",  // Rosa transparente
        "Agus": "rgba(33, 150, 243, 0.2)",  // Azul transparente
        "Papa": "rgba(255, 215, 0, 0.2)"    // Amarillo transparente
    };

    async function cargarReservas() {
        const response = await fetch(apiUrl);
        reservas = await response.json();
        mostrarReservas(reservas);
        actualizarCalendario();
    }

    async function agregarReserva() {
        const usuario = usuarioSelect.value;
        const fecha = fechaInput.value;
        const hora = horaSelect.value;
        const observaciones = observacionesInput.value;
    
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario, fecha, hora, observaciones })
        });
    
        const result = await response.json();
    
        if (response.ok) {
            alert('Reserva creada');
            cargarReservas();
        } else {
            alert(result.error || 'Error al crear reserva');
        }
    }
    

    async function eliminarReserva(id) {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Reserva eliminada');
            cargarReservas();
        } else {
            alert('Error al eliminar reserva');
        }
    }

    function mostrarReservas(reservas) {
        listaReservas.innerHTML = "";
        reservas.forEach(res => {
            const div = document.createElement("div");
            div.className = "reserva";
            
            // Obtener el color del usuario
            const colorUsuario = coloresUsuarios[res.usuario] || "rgba(0, 0, 0, 0.1)";  // Color por defecto
    
            // Asignar color de fondo al div que contiene toda la reserva
            div.style.backgroundColor = colorUsuario;
            div.style.padding = '10px';
            div.style.marginBottom = '10px';
            div.style.border = '1px solid #ccc';
            div.style.borderRadius = '8px';
            div.style.display = 'flex';
            div.style.flexDirection = 'column';  // Asegura que los elementos dentro estén apilados verticalmente
            div.style.alignItems = 'flex-start'; // Alinea el contenido a la izquierda
            div.style.justifyContent = 'space-between';
    
            div.innerHTML = `
                <span class='reserva-info'>
                    <b>${res.usuario}</b> - ${res.fecha} - ${res.hora}
                    <br>
                    ${res.observaciones ? `<i>Obs: ${res.observaciones}</i>` : ''}
                </span>
                <button class='cancelar' data-id="${res.id}">Cancelar</button>
            `;
            
            listaReservas.appendChild(div);
        });
    
        // Asignar el evento de eliminar a cada botón
        const botonesEliminar = document.querySelectorAll('.cancelar');
        botonesEliminar.forEach(boton => {
            boton.addEventListener('click', function() {
                const reservaId = this.getAttribute('data-id');
                eliminarReserva(reservaId);
            });
        });
    }
    
    

    function actualizarCalendario() {
        calendarioDiv.innerHTML = "";
        const fechasUnicas = [...new Set(reservas.map(res => res.fecha))];
        fechasUnicas.forEach(fecha => {
            const date = new Date(fecha + "T00:00:00");
            const opciones = { weekday: 'long', day: 'numeric' };
            const formatoFecha = date.toLocaleDateString('es-ES', opciones);
            const div = document.createElement("div");
            div.className = "calendario-dia";
            div.innerHTML = `<b>${formatoFecha}</b>`;
            calendarioDiv.appendChild(div);
        });
    }

    reservarBtn.addEventListener("click", agregarReserva);

    cargarReservas();

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then((registration) => {
                console.log('Service Worker registrado con éxito:', registration.scope);
            })
            .catch((error) => {
                console.log('Error al registrar el Service Worker:', error);
            });
    }
    
});
