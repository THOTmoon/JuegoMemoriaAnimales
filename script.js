document.addEventListener("DOMContentLoaded", () => {
    const tablero = document.getElementById("tablero");
    const tiempoDisplay = document.getElementById("tiempo");
    const intentosDisplay = document.getElementById("intentos");
    const mensajeDisplay = document.getElementById("mensaje");
    const botonReiniciar = document.getElementById("reiniciar");
  
    // Sonidos del juego
    let audioVoltear = new Audio('audio/Voltear.mp3');
    let audioVictoria = new Audio('audio/Victoria.mp3');
    let audioError = new Audio('audio/Error.mp3');
  
    // Asociar cada imagen con su archivo de audio
    const audiosPorImagen = {
      "Foto1.jpg": "audio/Bebeperro.mp3",
      "Foto2.jpg": "audio/Bebepanda.mp3",
      "Foto3.jpg": "audio/Bebeleon.mp3",
      "Foto4.jpg": "audio/Bebeelefante.mp3",
      "Foto5.jpg": "audio/Bebegato.mp3",
      "Foto6.jpg": "audio/Bebemono.mp3"
    };
  
    function playSound(audio) {
      try {
        audio.currentTime = 0;
        audio.play();
      } catch (e) {
        console.warn("Error al reproducir sonido:", e);
      }
    }
  
    const imagenes = [
      "Foto1.jpg",
      "Foto2.jpg",
      "Foto3.jpg",
      "Foto4.jpg",
      "Foto5.jpg",
      "Foto6.jpg"
    ];
  
    let juego = [...imagenes, ...imagenes];
    let primeraCarta = null;
    let segundaCarta = null;
    let bloqueoTablero = false;
  
    let intentos = 0;
    let tiempo = 0;
    let temporizador;
  
    function iniciarJuego() {
      // Reiniciar variables
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
  
      tablero.innerHTML = "";
  
      juego.sort(() => Math.random() - 0.5);
  
      juego.forEach((imagen, index) => {
        const carta = document.createElement("div");
        carta.classList.add("carta");
        carta.dataset.imagen = imagen;
  
        const cartaFlip = document.createElement("div");
        cartaFlip.classList.add("carta-flip");
  
        const frente = document.createElement("div");
        frente.classList.add("frente");
  
        const atras = document.createElement("div");
        atras.classList.add("atras");
        atras.style.backgroundImage = `url('images/${imagen}')`;
  
        cartaFlip.appendChild(frente);
        cartaFlip.appendChild(atras);
        carta.appendChild(cartaFlip);
        tablero.appendChild(carta);
  
        carta.addEventListener("click", () => {
          if (
            bloqueoTablero ||
            carta.classList.contains("abierta") ||
            carta.classList.contains("emparejada")
          ) {
            return;
          }
  
          // Reproducir sonido al voltear
          playSound(audioVoltear);
  
          voltearCarta(carta);
  
          if (!primeraCarta) {
            primeraCarta = carta;
          } else {
            segundaCarta = carta;
            bloqueoTablero = true;
  
            intentos++;
            intentosDisplay.textContent = intentos;
  
            if (primeraCarta.dataset.imagen === segundaCarta.dataset.imagen) {
              emparejarCartas(primeraCarta, segundaCarta);
  
              // Reproducir el audio específico para esta imagen
              const audioEmparejamiento = new Audio(audiosPorImagen[primeraCarta.dataset.imagen]);
              playSound(audioEmparejamiento);
  
              resetearSeleccion();
              verificarVictoria();
            } else {
              setTimeout(() => {
                desvoltearCartas(primeraCarta, segundaCarta);
                resetearSeleccion();
                playSound(audioError);
              }, 1000);
            }
          }
        });
      });
    }
  
    function voltearCarta(carta) {
      carta.classList.add("abierta");
    }
  
    function desvoltearCartas(c1, c2) {
      c1.classList.remove("abierta");
      c2.classList.remove("abierta");
    }
  
    function emparejarCartas(c1, c2) {
      c1.classList.add("emparejada");
      c2.classList.add("emparejada");
    }
  
    function resetearSeleccion() {
      primeraCarta = null;
      segundaCarta = null;
      bloqueoTablero = false;
    }
  
    function verificarVictoria() {
      const cartasEmparejadas = document.querySelectorAll(".emparejada");
      if (cartasEmparejadas.length === juego.length) {
        clearInterval(temporizador);
        mensajeDisplay.textContent = `🎉 ¡Felicidades! Has completado el juego en ${tiempo} segundos con ${intentos} intentos.`;
        mensajeDisplay.classList.add("mostrar");
        // Retrasar el sonido de victoria para asegurar que sea disparado por una acción del usuario
        setTimeout(() => playSound(audioVictoria), 500);
      }
    }
  
    botonReiniciar.addEventListener("click", () => {
      iniciarJuego();
    });
  
    iniciarJuego();
  });
