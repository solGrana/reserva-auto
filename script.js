document.addEventListener("DOMContentLoaded", async function () {
    // Elementos del DOM
    const usuarioSelect = document.getElementById("usuario");
    const fechaInput = document.getElementById("fecha");
    const horaSelect = document.getElementById("hora");
    const observacionesInput = document.getElementById("observaciones");
    const listaReservas = document.getElementById("listaReservas");
    const calendarioDiv = document.getElementById("calendario");
    const reservarBtn = document.getElementById("reservarBtn");
    const mesAnteriorBtn = document.getElementById("prevMonth");
    const mesSiguienteBtn = document.getElementById("nextMonth");
    const mesActualLabel = document.getElementById("currentMonth");

    /* const apiUrl = 'http://localhost:3000/reservas'; */
    const apiUrl = 'https://reservas-auto.onrender.com/reservas';


    let reservas = [];

    // Definir los colores para cada usuario
    const coloresUsuarios = {
        "Sol": "rgba(139, 38, 233, 0.25)",    // Violeta transparente
        "Pau": "rgba(255, 92, 92, 0.25)",  // Rosa transparente
        "Agus": "rgba(33, 150, 243, 0.25)",  // Azul transparente
        "Papa": "rgba(255, 215, 0, 0.25)"    // Amarillo transparente
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
            cargarReservas();// Recarga las reservas
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
    /* mostrar las reservas en la interfaz */
    function mostrarReservas(reservas) {
        listaReservas.innerHTML = "";// Limpia la lista de reservas existente

        reservas.forEach(res => {
            const div = document.createElement("div");
            div.className = "reserva";

            // Obtener el color del usuario y asignarlo como fondo de la reserva
            const colorUsuario = coloresUsuarios[res.usuario] || "rgba(0, 0, 0, 0.1)";  // Color default

            // estilo para la reserva
            div.style.backgroundColor = colorUsuario;
            div.style.padding = '10px';
            div.style.marginBottom = '10px';
            div.style.border = '1px solid #ccc';
            div.style.borderRadius = '8px';
            div.style.display = 'flex';
            div.style.flexDirection = 'column';  
            div.style.alignItems = 'flex-start'; 
            div.style.justifyContent = 'space-between';
            // Contenido de la reserva
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
            boton.addEventListener('click', function () {
                const reservaId = this.getAttribute('data-id');
                eliminarReserva(reservaId);
            });
        });
    }

  /*   let fechaActual = new Date();

    function actualizarCalendario() {
        calendarioDiv.innerHTML = "";

        const año = fechaActual.getFullYear();
        const mes = fechaActual.getMonth(); // Mes actual (0 = enero, 1 = febrero, etc.)

        // Título del mes actual
        const titulo = document.createElement("h3");
        titulo.textContent = fechaActual.toLocaleDateString("es-ES", { month: "long", year: "numeric" });
        calendarioDiv.appendChild(titulo);

        const tabla = document.createElement("table");
        tabla.classList.add("calendario-tabla");

        // header con los días de la semana 
        const diasSemana = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
        const headerRow = document.createElement("tr");
        diasSemana.forEach(dia => {
            const th = document.createElement("th");
            th.textContent = dia;
            headerRow.appendChild(th);
        });
        tabla.appendChild(headerRow);

        // Obtener el primer día del mes (ajustado para que Lunes sea 0)
        let primerDia = new Date(año, mes, 1).getDay(); // 0 = Domingo, 1 = Lunes...
        primerDia = (primerDia === 0) ? 6 : primerDia - 1; // Ajuste para que Lunes sea 0

        const totalDias = new Date(año, mes + 1, 0).getDate();
        let fila = document.createElement("tr");

        // Celdas vacías antes del primer día
        for (let i = 0; i < primerDia; i++) {
            fila.appendChild(document.createElement("td"));
        }

        let diaActual = 1;
        // Rellenar el calendario con los días
        while (diaActual <= totalDias) {
            const celda = document.createElement("td");
            celda.textContent = diaActual;

            // Verificar si hay reservas para este día
            const fechaStr = `${año}-${(mes + 1).toString().padStart(2, "0")}-${diaActual.toString().padStart(2, "0")}`;
            const reservasDia = reservas.filter(res => res.fecha === fechaStr);

            if (reservasDia.length > 0) {
                celda.classList.add("reserva-dia");
                celda.title = reservasDia.map(res => `${res.usuario}: ${res.hora}`).join("\n");
            }

            fila.appendChild(celda);

            // Si es domingo (posición 6), cerrar la fila y empezar otra
            if ((primerDia + diaActual) % 7 === 0) {
                tabla.appendChild(fila);
                fila = document.createElement("tr");
            }

            diaActual++;
        }

        // Agregar la última fila si tiene días pendientes
        if (fila.children.length > 0) {
            tabla.appendChild(fila);
        }

        calendarioDiv.appendChild(tabla);
    } */
        let fechaActual = new Date();
        function actualizarCalendario() {
            calendarioDiv.innerHTML = "";
        
            const año = fechaActual.getFullYear();
            const mes = fechaActual.getMonth(); // Mes actual (0 = enero, 1 = febrero, etc.)
        
            // Título del mes actual
            const titulo = document.createElement("h3");
            titulo.textContent = fechaActual.toLocaleDateString("es-ES", { month: "long", year: "numeric" });
            calendarioDiv.appendChild(titulo);
        
            const tabla = document.createElement("table");
            tabla.classList.add("calendario-tabla");
        
            // Header con los días de la semana 
            const diasSemana = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
            const headerRow = document.createElement("tr");
            diasSemana.forEach(dia => {
                const th = document.createElement("th");
                th.textContent = dia;
                headerRow.appendChild(th);
            });
            tabla.appendChild(headerRow);
        
            // Obtener el primer día del mes (ajustado para que Lunes sea 0)
            let primerDia = new Date(año, mes, 1).getDay(); // 0 = Domingo, 1 = Lunes...
            primerDia = (primerDia === 0) ? 6 : primerDia - 1; // Ajuste para que Lunes sea 0
        
            const totalDias = new Date(año, mes + 1, 0).getDate();
            let fila = document.createElement("tr");
        
            // Celdas vacías antes del primer día
            for (let i = 0; i < primerDia; i++) {
                fila.appendChild(document.createElement("td"));
            }
        
            let diaActual = 1;
            while (diaActual <= totalDias) {
                const celda = document.createElement("td");
                celda.textContent = diaActual;
        
                // Verificar si hay reservas para este día
                const fechaStr = `${año}-${(mes + 1).toString().padStart(2, "0")}-${diaActual.toString().padStart(2, "0")}`;
                const reservasDia = reservas.filter(res => res.fecha === fechaStr);
        
                if (reservasDia.length > 0) {
                    const colores = reservasDia.map(res => coloresUsuarios[res.usuario] || "rgba(0, 0, 0, 0.1)");
                    
                    if (colores.length === 1) {
                        celda.style.backgroundColor = colores[0]; // Un solo color
                    } else {
                        celda.style.background = `linear-gradient(to right, ${colores.join(", ")})`; // Múltiples colores
                    }
                    
                    celda.title = reservasDia.map(res => `${res.usuario}: ${res.hora}`).join("\n");
                }
        
                fila.appendChild(celda);
        
                // Si es domingo (posición 6), cerrar la fila y empezar otra
                if ((primerDia + diaActual) % 7 === 0) {
                    tabla.appendChild(fila);
                    fila = document.createElement("tr");
                }
        
                diaActual++;
            }
        
            if (fila.children.length > 0) {
                tabla.appendChild(fila);
            }
        
            calendarioDiv.appendChild(tabla);
        }
        

    mesAnteriorBtn.addEventListener("click", () => {
        fechaActual.setMonth(fechaActual.getMonth() - 1);
        actualizarCalendario();
    });

    mesSiguienteBtn.addEventListener("click", () => {
        fechaActual.setMonth(fechaActual.getMonth() + 1);
        actualizarCalendario();
    });

    reservarBtn.addEventListener("click", agregarReserva);

    cargarReservas();

    // Registrando el Service Worker
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
