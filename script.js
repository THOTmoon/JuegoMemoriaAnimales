// ======================================================== //
// --- SCRIPT.JS FINAL - CON SONIDO Y SOMBRA ACTIVADOS --- //
// ======================================================== //

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. SELECTORES DE ELEMENTOS DEL DOM ---
  const pantallaInicio = document.getElementById('pantalla-inicio');
  const botonJugar = document.getElementById('boton-jugar');
  const sonidoInicio = document.getElementById('sonido-inicio'); // <-- ✅ Seleccionamos el nuevo audio
  
  const juegoPrincipal = document.getElementById('juego-principal');
  const tablero = document.getElementById('tablero');
  const tiempoDisplay = document.getElementById('tiempo');
  const intentosDisplay = document.getElementById('intentos');
  const mensajeDisplay = document.getElementById('mensaje');
  const botonReiniciar = document.getElementById('reiniciar');

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
    // ✅ REPRODUCIMOS EL SONIDO AL INICIO DE LA PARTIDA
    playSound(sonidoInicio);
    
    // Oculta la pantalla de inicio y muestra el tablero del juego
    pantallaInicio.classList.add('hidden');
    juegoPrincipal.classList.remove('hidden');

    resetearEstadoJuego();
    generarTablero();
  }
  
  // (El resto de tus funciones no necesitan cambios)

  function resetearEstadoJuego() {
    primeraCarta = null;
    segundaCarta = null;
    bloqueoTablero = false;
    intentos = 0;
    tiempo = 0;
    
    mensajeDisplay.classList.remove("mostrar");
    mensajeDisplay.textContent = "";
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

  function verificarVictoria() {
    if (document.querySelectorAll(".emparejada").length === juego.length) {
      clearInterval(temporizador);
      mensajeDisplay.textContent = `🎉 ¡Felicidades! Has completado el juego en ${tiempo} segundos con ${intentos} intentos.`;
      mensajeDisplay.classList.add("mostrar");
      playSound(audioVictoria);
    }
  }

}); // --- Fin del addEventListener 'DOMContentLoaded' ---
