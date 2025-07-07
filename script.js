// ======================================================== //
// --- SCRIPT.JS ACTUALIZADO CON VIDEO DE VICTORIA --- //
// ======================================================== //

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. SELECTORES DE ELEMENTOS DEL DOM ---
  const pantallaInicio = document.getElementById('pantalla-inicio');
  const botonJugar = document.getElementById('boton-jugar');
  const sonidoInicio = document.getElementById('sonido-inicio');
  
  const juegoPrincipal = document.getElementById('juego-principal');
  const tablero = document.getElementById('tablero');
  const tiempoDisplay = document.getElementById('tiempo');
  const intentosDisplay = document.getElementById('intentos');
  const mensajeDisplay = document.getElementById('mensaje');
  const botonReiniciar = document.getElementById('reiniciar');

  // --- Selectores para la pantalla de victoria ---
  const pantallaVictoria = document.getElementById('pantalla-victoria');
  const videoCelebracion = document.getElementById('video-celebracion');


  // --- SONIDOS DEL JUEGO ---
  const audioVoltear = new Audio('audio/Voltear.mp3');
  const audioVictoria = new Audio('audio/Victoria.mp3');
  const audioError = new Audio('audio/Error.mp3');

  function playSound(audio) {
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(error => console.log("Error al reproducir sonido:", error));
    }
  }

  // --- DATOS Y VARIABLES DE ESTADO DEL JUEGO ---
  const imagenes = ["Foto1.jpg", "Foto2.jpg", "Foto3.jpg", "Foto4.jpg", "Foto5.jpg", "Foto6.jpg"];
  const audiosPorImagen = {
    "Foto1.jpg": "audio/Bebeperro.mp3",
    "Foto2.jpg": "audio/Bebepanda.mp3",
    "Foto3.jpg": "audio/Bebeleon.mp3",
    "Foto4.jpg": "audio/Bebeelefante.mp3",
    "Foto5.jpg": "audio/Bebegato.mp3",
    "Foto6.jpg": "audio/Bebemono.mp3"
  };
  // Array con los nombres de los videos de celebración
  const videosCelebracion = [
    "celebracion-Foto1.mp4", "celebracion-Foto2.mp4", "celebracion-Foto3.mp4",
    "celebracion-Foto4.mp4", "celebracion-Foto5.mp4", "celebracion-Foto6.mp4"
  ];
  
  let juego;
  let primeraCarta = null;
  let segundaCarta = null;
  let bloqueoTablero = false;
  let intentos = 0;
  let tiempo = 0;
  let temporizador;

  // --- 2. LÓGICA PRINCIPAL Y FLUJO DE LA APLICACIÓN ---
  botonJugar.addEventListener('click', iniciarPartida);
  botonReiniciar.addEventListener('click', iniciarPartida);

  function iniciarPartida() {
    playSound(sonidoInicio);
    
    // Oculta las pantallas modales y muestra el tablero del juego
    pantallaInicio.classList.add('hidden');
    pantallaVictoria.classList.add('hidden'); // Asegura que la pantalla de victoria esté oculta
    juegoPrincipal.classList.remove('hidden');

    resetearEstadoJuego();
    generarTablero();
  }

  function resetearEstadoJuego() {
    primeraCarta = null;
    segundaCarta = null;
    bloqueoTablero = false;
    intentos = 0;
    tiempo = 0;
    
    mensajeDisplay.textContent = "";
    // Oculta el mensaje si tiene una clase para mostrarlo (ej. 'mostrar')
    mensajeDisplay.classList.remove("mostrar"); 
    
    intentosDisplay.textContent = intentos;
    tiempoDisplay.textContent = tiempo;
    
    clearInterval(temporizador);
    temporizador = setInterval(() => {
      tiempo++;
      tiempoDisplay.textContent = tiempo;
    }, 1000);
  }

  function generarTablero() {
    tablero.innerHTML = "";
    juego = [...imagenes, ...imagenes];
    juego.sort(() => Math.random() - 0.5);

    juego.forEach(imagen => {
      const carta = document.createElement("div");
      carta.classList.add("carta");
      carta.dataset.imagen = imagen;
      carta.innerHTML = `
        <div class="carta-flip">
          <div class="frente"></div>
          <div class="atras" style="background-image: url('images/${imagen}')"></div>
        </div>
      `;
      carta.addEventListener("click", () => manejarClickCarta(carta));
      tablero.appendChild(carta);
    });
  }

  function manejarClickCarta(carta) {
    if (bloqueoTablero || carta === primeraCarta || carta.classList.contains("emparejada")) {
      return;
    }

    playSound(audioVoltear);
    carta.classList.add("abierta");

    if (!primeraCarta) {
      primeraCarta = carta;
    } else {
      segundaCarta = carta;
      intentos++;
      intentosDisplay.textContent = intentos;
      bloqueoTablero = true;
      verificarCoincidencia();
    }
  }

  function verificarCoincidencia() {
    const esCoincidencia = primeraCarta.dataset.imagen === segundaCarta.dataset.imagen;
    esCoincidencia ? manejarCoincidencia() : manejarNoCoincidencia();
  }

  function manejarCoincidencia() {
    primeraCarta.classList.add("emparejada");
    segundaCarta.classList.add("emparejada");
    
    const audioEmparejamiento = new Audio(audiosPorImagen[primeraCarta.dataset.imagen]);
    playSound(audioEmparejamiento);
    
    resetearTurno();
    verificarVictoria();
  }

  function manejarNoCoincidencia() {
    playSound(audioError);
    setTimeout(() => {
      primeraCarta.classList.remove("abierta");
      segundaCarta.classList.remove("abierta");
      resetearTurno();
    }, 1000);
  }

  function resetearTurno() {
    [primeraCarta, segundaCarta, bloqueoTablero] = [null, null, false];
  }

  // --- FUNCIÓN DE VICTORIA MODIFICADA ---
  function verificarVictoria() {
    if (document.querySelectorAll(".emparejada").length === juego.length) {
      clearInterval(temporizador);
      playSound(audioVictoria);

      // Esperamos un momento antes de mostrar el video para que el usuario vea la última pareja
      setTimeout(() => {
        mostrarVideoAleatorio();
      }, 800);
    }
  }

  // --- NUEVA FUNCIÓN PARA MOSTRAR VIDEO DE CELEBRACIÓN ---
  function mostrarVideoAleatorio() {
    // 1. Elegir un video al azar
    const indiceAleatorio = Math.floor(Math.random() * videosCelebracion.length);
    const videoSeleccionado = videosCelebracion[indiceAleatorio];

    // 2. Asignar la fuente del video y mostrar la pantalla de victoria
    videoCelebracion.src = `videos/${videoSeleccionado}`;
    pantallaVictoria.classList.remove('hidden');

    // 3. Reproducir el video (con manejo de errores por si el navegador lo bloquea)
    videoCelebracion.play().catch(error => {
      console.error("Error al intentar reproducir el video de victoria:", error);
      // Si falla la reproducción, mostramos el mensaje de texto como fallback
      mostrarMensajeFinal();
    });

    // 4. Cuando el video termina, lo ocultamos y mostramos el mensaje final
    videoCelebracion.onended = () => {
      pantallaVictoria.classList.add('hidden');
      mostrarMensajeFinal();
    };
  }

  // --- NUEVA FUNCIÓN PARA MOSTRAR EL TEXTO FINAL ---
  function mostrarMensajeFinal() {
    mensajeDisplay.textContent = `🎉 ¡Felicidades! Has completado el juego en ${tiempo} segundos con ${intentos} intentos.`;
    mensajeDisplay.classList.add("mostrar"); // Usa una clase si quieres animar la aparición del texto
  }

}); // --- Fin del addEventListener 'DOMContentLoaded' ---
