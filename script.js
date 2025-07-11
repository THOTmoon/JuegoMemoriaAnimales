// ======================================================== //
// --- SCRIPT.JS ACTUALIZADO CON GIF DE VICTORIA --- //
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
  // !!! IMPORTANTE: Este selector ahora apunta a un elemento <IMG> con este ID !!!
  const elementoCelebracion = document.getElementById('video-celebracion');


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
  // Array con los nombres de los GIF de celebración (¡Actualizado a .gif!)
  const gifsCelebracion = [
    "celebracion-Foto1.gif", "celebracion-Foto2.gif", "celebracion-Foto3.gif", // Asegúrate que estos sean los nombres reales de tus archivos GIF
    "celebracion-Foto4.gif", "celebracion-Foto5.gif", "celebracion-Foto6.gif"
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

    // Opcional: Limpiar la fuente del GIF al iniciar una nueva partida
    elementoCelebracion.src = '';


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

      // Esperamos un momento antes de mostrar el GIF
      setTimeout(() => {
        // Llama a la nueva función que muestra el GIF
        mostrarGifAleatorio(); // <--- CAMBIADO
      }, 800);
    }
  }

  // --- FUNCIÓN PARA MOSTRAR GIF DE CELEBRACIÓN (MODIFICADA) ---
  // Antes llamada mostrarVideoAleatorio
  function mostrarGifAleatorio() { // <--- NOMBRE CAMBIADO (opcional)
    // 1. Elegir un GIF al azar
    const indiceAleatorio = Math.floor(Math.random() * gifsCelebracion.length); // Usar el array de GIFs
    const gifSeleccionado = gifsCelebracion[indiceAleatorio];

    // 2. Asignar la fuente del GIF y mostrar la pantalla de victoria
    // Asegúrate de que 'elementoCelebracion' se refiere a tu elemento <img>
    // y que la ruta 'gifs/' sea correcta para tus archivos GIF.
    elementoCelebracion.src = `gifs/${gifSeleccionado}`; // <--- Asigna la fuente .gif (verifica la ruta)
    pantallaVictoria.classList.remove('hidden');

    // !!! ELIMINADO: No necesitas llamar a .play() ni manejar errores de reproducción de video
    // porque los GIFs se reproducen automáticamente en un elemento <img>
    // videoCelebracion.play().catch(...)

    // !!! ELIMINADO: No necesitas el evento onended porque los GIFs no tienen este evento y se repiten
    // videoCelebracion.onended = () => { ... }

    // 3. Configurar un temporizador para ocultar el GIF y mostrar el mensaje final
    // Ajusta este tiempo (en milisegundos) si quieres que el GIF se muestre más o menos tiempo.
    const duracionMostrandoGif = 5000; // Muestra el GIF por 3 segundos (ejemplo)

    setTimeout(() => {
      pantallaVictoria.classList.add('hidden');
      mostrarMensajeFinal();
      // Opcional: Limpiar la fuente del GIF después de ocultarlo para liberar memoria
      elementoCelebracion.src = '';
    }, duracionMostrandoGif);
  }

  // --- FUNCIÓN PARA MOSTRAR EL TEXTO FINAL ---
  function mostrarMensajeFinal() {
    mensajeDisplay.textContent = `🎉 ¡Felicidades! Has completado el juego en ${tiempo} segundos con ${intentos} intentos.`;
    mensajeDisplay.classList.add("mostrar"); // Usa una clase si quieres animar la aparición del texto
  }

}); // --- Fin del addEventListener 'DOMContentLoaded' ---
