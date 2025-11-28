<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// Estado del juego
const selectedCategory = ref(null);
const selectedCategoryName = ref(null);
const selectedLevel = ref(null);
const selectedLevelName = ref(null);
const maxAttempts = ref(8);
const remainingAttempts = ref(8);
const currentWord = ref("");
const currentHint = ref("");
const guessedLetters = ref([]);
const wrongLetters = ref([]);
const gameStatus = ref("playing"); // playing, won, lost
const showModal = ref(false);

// Estado del tiempo
const startTime = ref(null);
const elapsedTime = ref(0);
const timerInterval = ref(null);
const playerName = ref("");

// Iconos de categorías
const categoryIcons = {
  deportes: "/src/icon/icon-pelota.png",
  alimentacion: "/src/icon/icon-manzana.png",
  geografia: "/src/icon/icon-PlanetaTierra.png",
  animales: "/src/icon/icon-leon.png",
  entretenimiento: "/src/icon/icon-palomitas.png",
  ciencia: "/src/icon/icon-ciencias.png",
};

// Base de datos de palabras por categoría y nivel
const wordDatabase = {
  deportes: {
    facil: [
      { word: "BALON", hint: "Se usa para jugar fútbol" },
      { word: "GOLES", hint: "Se marcan en el fútbol" },
      { word: "TENIS", hint: "Deporte con raqueta" },
      { word: "BOXEO", hint: "Deporte de combate con guantes" },
      { word: "SALTO", hint: "Acción de elevarse del suelo" },
      { word: "PISTA", hint: "Lugar donde se corre" },
      { word: "REMO", hint: "Deporte acuático con bote" },
      { word: "YOGA", hint: "Disciplina de meditación y ejercicio" },
    ],
    medio: [
      { word: "NATACION", hint: "Deporte en el agua" },
      { word: "FUTBOL", hint: "El deporte más popular del mundo" },
      { word: "BASQUET", hint: "Se juega con un aro y pelota naranja" },
      { word: "VOLEIBOL", hint: "Se juega con red en medio" },
      { word: "ATLETISMO", hint: "Incluye carreras y saltos" },
      { word: "CICLISMO", hint: "Deporte sobre dos ruedas" },
      { word: "GIMNASIA", hint: "Requiere flexibilidad y equilibrio" },
      { word: "ESCALADA", hint: "Subir montañas o paredes" },
    ],
    dificil: [
      { word: "HALTEROFILIA", hint: "Levantamiento de pesas olímpico" },
      { word: "PENTATHLON", hint: "Competencia de cinco disciplinas" },
      { word: "ESGRIMA", hint: "Combate con espadas" },
      { word: "PARACAIDISMO", hint: "Saltar desde un avión" },
      { word: "TAEKWONDO", hint: "Arte marcial coreano" },
      { word: "TRIATHLON", hint: "Natación, ciclismo y carrera" },
      { word: "BALONMANO", hint: "Se juega con las manos y portería" },
      { word: "WATERPOLO", hint: "Fútbol en el agua" },
    ],
  },
  alimentacion: {
    facil: [
      { word: "MANZANA", hint: "Fruta roja o verde" },
      { word: "LECHE", hint: "Bebida blanca de vaca" },
      { word: "HUEVO", hint: "Lo ponen las gallinas" },
      { word: "QUESO", hint: "Producto lácteo amarillo" },
      { word: "ARROZ", hint: "Grano blanco asiático" },
      { word: "PASTA", hint: "Comida italiana con salsa" },
      { word: "CARNE", hint: "Proteína de animales" },
      { word: "PERA", hint: "Fruta con forma de campana" },
    ],
    medio: [
      { word: "ZANAHORIA", hint: "Verdura naranja que comen los conejos" },
      { word: "BROCOLI", hint: "Verdura verde como árbol pequeño" },
      { word: "PLATANO", hint: "Fruta amarilla alargada" },
      { word: "TOMATE", hint: "Fruta roja usada en ensaladas" },
      { word: "ESPINACA", hint: "Verdura verde de Popeye" },
      { word: "NARANJA", hint: "Fruta cítrica del mismo color" },
      { word: "AGUACATE", hint: "Fruta verde cremosa para guacamole" },
      { word: "LECHUGA", hint: "Base verde de las ensaladas" },
    ],
    dificil: [
      { word: "COLIFLOR", hint: "Verdura blanca similar al brócoli" },
      { word: "BERENJENA", hint: "Verdura morada alargada" },
      { word: "ALCACHOFA", hint: "Verdura con hojas que se pelan" },
      { word: "FRAMBUESA", hint: "Fruta roja pequeña y dulce" },
      { word: "ARANDANO", hint: "Fruta azul pequeña antioxidante" },
      { word: "CALABAZA", hint: "Verdura naranja de Halloween" },
      { word: "ESPARRAGO", hint: "Verdura verde en forma de lanza" },
      { word: "MANDARINA", hint: "Cítrico pequeño fácil de pelar" },
    ],
  },
  geografia: {
    facil: [
      { word: "PARIS", hint: "Capital de Francia" },
      { word: "RIO", hint: "Corriente de agua dulce" },
      { word: "MONTE", hint: "Elevación natural del terreno" },
      { word: "PLAYA", hint: "Orilla del mar con arena" },
      { word: "ISLA", hint: "Tierra rodeada de agua" },
      { word: "LAGO", hint: "Masa de agua rodeada de tierra" },
      { word: "SELVA", hint: "Bosque tropical denso" },
      { word: "DUNA", hint: "Montículo de arena" },
    ],
    medio: [
      { word: "COLOMBIA", hint: "País sudamericano del café" },
      { word: "VOLCAN", hint: "Montaña que expulsa lava" },
      { word: "DESIERTO", hint: "Zona árida con poca lluvia" },
      { word: "OCEANO", hint: "Gran masa de agua salada" },
      { word: "CASCADA", hint: "Caída de agua desde altura" },
      { word: "GLACIAR", hint: "Masa de hielo en movimiento" },
      { word: "PENINSULA", hint: "Tierra rodeada de agua por tres lados" },
      { word: "ARCHIPIELAGO", hint: "Conjunto de islas" },
    ],
    dificil: [
      { word: "KILIMANJARO", hint: "Montaña más alta de África" },
      { word: "AMAZONAS", hint: "Río más caudaloso del mundo" },
      { word: "ANTARTIDA", hint: "Continente helado del sur" },
      { word: "HIMALAYA", hint: "Cordillera más alta del mundo" },
      { word: "SAHARA", hint: "Desierto más grande del mundo" },
      { word: "MEDITERRANEO", hint: "Mar entre Europa y África" },
      { word: "PACIFICO", hint: "Océano más grande del planeta" },
      { word: "EVEREST", hint: "Montaña más alta del mundo" },
    ],
  },
  animales: {
    facil: [
      { word: "PERRO", hint: "Mejor amigo del hombre" },
      { word: "GATO", hint: "Mascota que maúlla" },
      { word: "LEON", hint: "Rey de la selva" },
      { word: "TIGRE", hint: "Felino con rayas" },
      { word: "PATO", hint: "Ave acuática que hace cuac" },
      { word: "VACA", hint: "Animal que da leche" },
      { word: "OVEJA", hint: "Animal con lana" },
      { word: "POLLO", hint: "Ave de corral" },
    ],
    medio: [
      { word: "ELEFANTE", hint: "Animal más grande de tierra" },
      { word: "JIRAFA", hint: "Animal con cuello muy largo" },
      { word: "DELFIN", hint: "Mamífero marino inteligente" },
      { word: "CANGURO", hint: "Animal que salta con bolsa" },
      { word: "PINGUINO", hint: "Ave que no vuela y vive en hielo" },
      { word: "COCODRILO", hint: "Reptil de río con dientes grandes" },
      { word: "SERPIENTE", hint: "Reptil sin patas que repta" },
      { word: "TORTUGA", hint: "Reptil con caparazón" },
    ],
    dificil: [
      { word: "RINOCERONTE", hint: "Animal con cuerno en la nariz" },
      { word: "HIPOPOTAMO", hint: "Animal grande que vive en ríos africanos" },
      { word: "ORNITORRINCO", hint: "Mamífero con pico de pato" },
      { word: "MURCIELAGO", hint: "Mamífero volador nocturno" },
      { word: "CAMALEON", hint: "Reptil que cambia de color" },
      { word: "KOALA", hint: "Marsupial australiano que come eucalipto" },
      { word: "ARMADILLO", hint: "Animal con armadura natural" },
      { word: "FLAMENCO", hint: "Ave rosada de patas largas" },
    ],
  },
  entretenimiento: {
    facil: [
      { word: "CINE", hint: "Lugar para ver películas" },
      { word: "ACTOR", hint: "Persona que actúa en películas" },
      { word: "MUSICA", hint: "Arte de los sonidos" },
      { word: "BAILE", hint: "Movimiento al ritmo de música" },
      { word: "SERIE", hint: "Programa de TV con episodios" },
      { word: "JUEGO", hint: "Actividad recreativa" },
      { word: "LIBRO", hint: "Conjunto de páginas para leer" },
      { word: "RADIO", hint: "Medio de comunicación por ondas" },
    ],
    medio: [
      { word: "PELICULA", hint: "Producción cinematográfica" },
      { word: "CONCIERTO", hint: "Presentación musical en vivo" },
      { word: "TEATRO", hint: "Arte escénico con actores" },
      { word: "VIDEOJUEGO", hint: "Juego electrónico interactivo" },
      { word: "COMEDIA", hint: "Género que hace reír" },
      { word: "FESTIVAL", hint: "Celebración con eventos culturales" },
      { word: "PODCAST", hint: "Programa de audio digital" },
      { word: "STREAMING", hint: "Transmisión en línea" },
    ],
    dificil: [
      { word: "CINEMATOGRAFIA", hint: "Arte de hacer películas" },
      { word: "DOCUMENTAL", hint: "Película sobre hechos reales" },
      { word: "ANIMACION", hint: "Técnica de dar movimiento a dibujos" },
      { word: "BLOCKBUSTER", hint: "Película de gran éxito comercial" },
      { word: "SOUNDTRACK", hint: "Música de una película" },
      { word: "MARATON", hint: "Ver muchos episodios seguidos" },
      { word: "PLATAFORMA", hint: "Servicio de streaming digital" },
      { word: "INFLUENCER", hint: "Persona con muchos seguidores en redes" },
    ],
  },
  ciencia: {
    facil: [
      { word: "ATOMO", hint: "Partícula más pequeña de materia" },
      { word: "CELULA", hint: "Unidad básica de la vida" },
      { word: "AGUA", hint: "H2O líquido vital" },
      { word: "LUZ", hint: "Energía que nos permite ver" },
      { word: "AIRE", hint: "Mezcla de gases que respiramos" },
      { word: "ROCA", hint: "Material sólido de la tierra" },
      { word: "PLANTA", hint: "Ser vivo que hace fotosíntesis" },
      { word: "VIRUS", hint: "Agente infeccioso microscópico" },
    ],
    medio: [
      { word: "ELECTRON", hint: "Partícula con carga negativa" },
      { word: "GRAVEDAD", hint: "Fuerza que nos mantiene en tierra" },
      { word: "OXIGENO", hint: "Gas esencial para respirar" },
      { word: "ENERGIA", hint: "Capacidad de realizar trabajo" },
      { word: "MOLECULA", hint: "Conjunto de átomos unidos" },
      { word: "BACTERIA", hint: "Microorganismo unicelular" },
      { word: "TELESCOPIO", hint: "Instrumento para ver estrellas" },
      { word: "DINOSAURIO", hint: "Reptil prehistórico extinto" },
    ],
    dificil: [
      { word: "FOTOSINTESIS", hint: "Proceso de plantas para crear alimento" },
      { word: "CROMOSOMA", hint: "Estructura que contiene ADN" },
      { word: "ELECTROMAGNETISMO", hint: "Fuerza entre cargas eléctricas" },
      { word: "TERMODINAMICA", hint: "Estudio del calor y energía" },
      { word: "BIODIVERSIDAD", hint: "Variedad de vida en la Tierra" },
      { word: "ECOSISTEMA", hint: "Comunidad de seres vivos y su entorno" },
      { word: "EVOLUCION", hint: "Cambio de especies con el tiempo" },
      { word: "ASTRONOMIA", hint: "Ciencia que estudia el universo" },
    ],
  },
};

// Alfabeto para el teclado
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// Computed properties
const currentCategoryIcon = computed(() => {
  return selectedCategory.value
    ? categoryIcons[selectedCategory.value]
    : "/src/icon/icon-pelota.png";
});

const displayWord = computed(() => {
  return currentWord.value
    .split("")
    .map((letter) => (guessedLetters.value.includes(letter) ? letter : "_"))
    .join(" ");
});

const hangmanParts = computed(() => {
  const errors = wrongLetters.value.length;
  return {
    head: errors >= 1,
    body: errors >= 2,
    leftArm: errors >= 3,
    rightArm: errors >= 4,
    leftLeg: errors >= 5,
    rightLeg: errors >= 6,
    leftEye: errors >= 7,
    rightEye: errors >= 8,
  };
});

// Funciones
const volverInicio = () => {
  router.push("/");
};

const volverNiveles = () => {
  router.push("/niveles");
};

const irATiempos = () => {
  router.push("/tiempos");
};

const initGame = () => {
  // Cargar datos de localStorage
  selectedCategory.value = localStorage.getItem("selectedCategory");
  selectedCategoryName.value = localStorage.getItem("selectedCategoryName");
  selectedLevel.value = localStorage.getItem("selectedLevel");
  selectedLevelName.value = localStorage.getItem("selectedLevelName");
  maxAttempts.value = parseInt(
    localStorage.getItem("selectedLevelAttempts") || "8"
  );
  remainingAttempts.value = maxAttempts.value;

  // Verificar que hay datos
  if (!selectedCategory.value || !selectedLevel.value) {
    alert("Por favor, selecciona una característica y nivel primero");
    router.push("/caracteristicas");
    return;
  }

  // Seleccionar palabra aleatoria
  selectRandomWord();
};

const selectRandomWord = () => {
  const categoryWords = wordDatabase[selectedCategory.value];
  const levelWords = categoryWords[selectedLevel.value];

  if (!levelWords || levelWords.length === 0) {
    alert("No hay palabras disponibles para esta combinación");
    return;
  }

  const randomIndex = Math.floor(Math.random() * levelWords.length);
  const selectedWordData = levelWords[randomIndex];

  currentWord.value = selectedWordData.word;
  currentHint.value = selectedWordData.hint;
  guessedLetters.value = [];
  wrongLetters.value = [];
  gameStatus.value = "playing";
  remainingAttempts.value = maxAttempts.value;
};

const selectLetter = (letter) => {
  if (
    gameStatus.value !== "playing" ||
    guessedLetters.value.includes(letter) ||
    wrongLetters.value.includes(letter)
  ) {
    return;
  }

  if (currentWord.value.includes(letter)) {
    // Letra correcta
    guessedLetters.value.push(letter);

    // Verificar si ganó
    const allLettersGuessed = currentWord.value
      .split("")
      .every((l) => guessedLetters.value.includes(l));

    if (allLettersGuessed) {
      gameStatus.value = "won";
      stopTimer();
      saveGameResult(true);
      showModal.value = true;
    }
  } else {
    // Letra incorrecta
    wrongLetters.value.push(letter);
    remainingAttempts.value--;

    // Verificar si perdió
    if (remainingAttempts.value <= 0) {
      gameStatus.value = "lost";
      stopTimer();
      saveGameResult(false);
      showModal.value = true;
    }
  }
};

const getLetterClass = (letter) => {
  if (guessedLetters.value.includes(letter)) {
    return "correct";
  }
  if (wrongLetters.value.includes(letter)) {
    return "incorrect";
  }
  return "";
};

const isLetterDisabled = (letter) => {
  return (
    guessedLetters.value.includes(letter) ||
    wrongLetters.value.includes(letter) ||
    gameStatus.value !== "playing"
  );
};

const restartGame = () => {
  showModal.value = false;
  selectRandomWord();
  // Reiniciar cronómetro
  elapsedTime.value = 0;
  startTimer();
};

const closeModal = () => {
  showModal.value = false;
};

// Función para formatear tiempo
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

// Función para iniciar el cronómetro
const startTimer = () => {
  startTime.value = Date.now();
  timerInterval.value = setInterval(() => {
    elapsedTime.value = Math.floor((Date.now() - startTime.value) / 1000);
  }, 1000);
};

// Función para detener el cronómetro
const stopTimer = () => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
    timerInterval.value = null;
  }
};

// Función para guardar resultado del juego
const saveGameResult = (won) => {
  const gameResult = {
    id: Date.now(),
    playerName: playerName.value,
    time: elapsedTime.value,
    date: new Date().toLocaleDateString("es-ES"),
    timestamp: Date.now(),
    category: selectedCategory.value,
    categoryName: selectedCategoryName.value,
    level: selectedLevel.value,
    levelName: selectedLevelName.value,
    won: won,
  };

  // Obtener historial existente
  const history = JSON.parse(localStorage.getItem("gameHistory") || "[]");
  history.push(gameResult);
  localStorage.setItem("gameHistory", JSON.stringify(history));
};

// Montar componente
onMounted(() => {
  initGame();
  // Cargar nombre del jugador
  playerName.value = localStorage.getItem("playerName") || "Jugador";
  // Iniciar cronómetro
  startTimer();
});
</script>

<template>
  <div class="juego-container">
    <div class="game-wrapper">
      <!-- Header con información -->
      <div class="game-header">
        <div class="info-box category-box">
          <img :src="currentCategoryIcon" alt="Categoría" class="info-icon" />
          <div class="info-text">
            <span class="info-label">Categoría</span>
            <span class="info-value">{{ selectedCategoryName }}</span>
          </div>
        </div>

        <div class="info-box level-box">
          <div class="level-icon">🎯</div>
          <div class="info-text">
            <span class="info-label">Nivel</span>
            <span class="info-value">{{ selectedLevelName }}</span>
          </div>
        </div>

        <div class="info-box attempts-box">
          <div class="attempts-icon">❤️</div>
          <div class="info-text">
            <span class="info-label">Intentos</span>
            <span class="info-value"
              >{{ remainingAttempts }} / {{ maxAttempts }}</span
            >
          </div>
        </div>

        <div class="info-box time-box">
          <div class="time-icon">⏱️</div>
          <div class="info-text">
            <span class="info-label">Tiempo</span>
            <span class="info-value">{{ formatTime(elapsedTime) }}</span>
          </div>
        </div>

        <div class="info-box player-box">
          <div class="player-icon">👤</div>
          <div class="info-text">
            <span class="info-label">Jugador</span>
            <span class="info-value">{{ playerName }}</span>
          </div>
        </div>
      </div>

      <!-- Área principal del juego -->
      <div class="game-content">
        <!-- Dibujo del ahorcado -->
        <div class="hangman-area">
          <svg class="hangman-svg" viewBox="0 0 200 250">
            <!-- Base -->
            <line
              x1="10"
              y1="230"
              x2="150"
              y2="230"
              stroke="#8B4513"
              stroke-width="4"
            />
            <!-- Poste vertical -->
            <line
              x1="50"
              y1="230"
              x2="50"
              y2="20"
              stroke="#8B4513"
              stroke-width="4"
            />
            <!-- Poste horizontal -->
            <line
              x1="50"
              y1="20"
              x2="130"
              y2="20"
              stroke="#8B4513"
              stroke-width="4"
            />
            <!-- Cuerda -->
            <line
              x1="130"
              y1="20"
              x2="130"
              y2="50"
              stroke="#8B4513"
              stroke-width="2"
            />

            <!-- Cabeza -->
            <circle
              v-if="hangmanParts.head"
              cx="130"
              cy="70"
              r="20"
              stroke="#FF6B6B"
              stroke-width="3"
              fill="none"
              class="hangman-part"
            />

            <!-- Cuerpo -->
            <line
              v-if="hangmanParts.body"
              x1="130"
              y1="90"
              x2="130"
              y2="150"
              stroke="#FF6B6B"
              stroke-width="3"
              class="hangman-part"
            />

            <!-- Brazo izquierdo -->
            <line
              v-if="hangmanParts.leftArm"
              x1="130"
              y1="110"
              x2="100"
              y2="130"
              stroke="#FF6B6B"
              stroke-width="3"
              class="hangman-part"
            />

            <!-- Brazo derecho -->
            <line
              v-if="hangmanParts.rightArm"
              x1="130"
              y1="110"
              x2="160"
              y2="130"
              stroke="#FF6B6B"
              stroke-width="3"
              class="hangman-part"
            />

            <!-- Pierna izquierda -->
            <line
              v-if="hangmanParts.leftLeg"
              x1="130"
              y1="150"
              x2="110"
              y2="190"
              stroke="#FF6B6B"
              stroke-width="3"
              class="hangman-part"
            />

            <!-- Pierna derecha -->
            <line
              v-if="hangmanParts.rightLeg"
              x1="130"
              y1="150"
              x2="150"
              y2="190"
              stroke="#FF6B6B"
              stroke-width="3"
              class="hangman-part"
            />

            <!-- Ojo izquierdo -->
            <circle
              v-if="hangmanParts.leftEye"
              cx="122"
              cy="67"
              r="2"
              fill="#FF6B6B"
              class="hangman-part"
            />

            <!-- Ojo derecho -->
            <circle
              v-if="hangmanParts.rightEye"
              cx="138"
              cy="67"
              r="2"
              fill="#FF6B6B"
              class="hangman-part"
            />
          </svg>
        </div>

        <!-- Área de palabra y pista -->
        <div class="word-area">
          <div class="hint-box">
            <span class="hint-icon">💡</span>
            <span class="hint-text">{{ currentHint }}</span>
          </div>

          <div class="word-display">
            {{ displayWord }}
          </div>

          <div class="letters-used">
            <div
              class="letters-section correct-section"
              v-if="guessedLetters.length > 0"
            >
              <span class="section-label">✓ Correctas:</span>
              <span class="letters-list">{{ guessedLetters.join(", ") }}</span>
            </div>
            <div
              class="letters-section wrong-section"
              v-if="wrongLetters.length > 0"
            >
              <span class="section-label">✗ Incorrectas:</span>
              <span class="letters-list">{{ wrongLetters.join(", ") }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Teclado -->
      <div class="keyboard">
        <button
          v-for="letter in alphabet"
          :key="letter"
          class="key"
          :class="getLetterClass(letter)"
          :disabled="isLetterDisabled(letter)"
          @click="selectLetter(letter)"
        >
          {{ letter }}
        </button>
      </div>

      <!-- Botones de navegación -->
      <div class="game-buttons">
        <button class="game-btn back-btn" @click="volverInicio">
          ← Inicio
        </button>
        <button class="game-btn restart-btn" @click="restartGame">
          🔄 Nueva Palabra
        </button>
        <button class="game-btn times-btn" @click="irATiempos">
          ⏱️ Ver Tiempos
        </button>
        <button class="game-btn level-btn" @click="volverNiveles">
          Cambiar Nivel →
        </button>
      </div>
    </div>

    <!-- Modal de resultado -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header" :class="gameStatus">
          <h2 v-if="gameStatus === 'won'">🎉 ¡FELICITACIONES! 🎉</h2>
          <h2 v-else>😢 JUEGO TERMINADO</h2>
        </div>
        <div class="modal-body">
          <p v-if="gameStatus === 'won'" class="modal-message success">
            ¡Has adivinado la palabra correctamente!
          </p>
          <p v-else class="modal-message failure">
            Te has quedado sin intentos
          </p>
          <div class="modal-word">
            <span class="word-label">La palabra era:</span>
            <span class="word-value">{{ currentWord }}</span>
          </div>
          <div class="modal-stats">
            <div class="stat-item">
              <span class="stat-icon">⏱️</span>
              <span class="stat-text">{{ formatTime(elapsedTime) }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-icon">✓</span>
              <span class="stat-text"
                >{{ guessedLetters.length }} correctas</span
              >
            </div>
            <div class="stat-item">
              <span class="stat-icon">✗</span>
              <span class="stat-text"
                >{{ wrongLetters.length }} incorrectas</span
              >
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="modal-btn play-again-btn" @click="restartGame">
            🎮 Jugar de Nuevo
          </button>
          <button class="modal-btn times-btn" @click="irATiempos">
            ⏱️ Ver Tiempos
          </button>
          <button class="modal-btn change-level-btn" @click="volverNiveles">
            🎯 Cambiar Nivel
          </button>
          <button class="modal-btn home-btn" @click="volverInicio">
            🏠 Ir al Inicio
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.juego-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}

.game-wrapper {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  animation: fadeIn 0.8s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Header con información */
.game-header {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.info-box {
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.15) 0%,
    rgba(118, 75, 162, 0.15) 100%
  );
  border-radius: 15px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 2px solid rgba(102, 126, 234, 0.3);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.info-box:hover {
  transform: translateY(-5px);
}

.info-icon {
  width: 50px;
  height: 50px;
  object-fit: contain;
}

.level-icon,
.attempts-icon {
  font-size: 2.5rem;
}

.info-text {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.info-label {
  font-size: 0.85rem;
  color: #c6c6c6;
  font-weight: 600;
}

.info-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: white;
}

.attempts-box .info-value {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Caja de tiempo */
.time-box {
  background: linear-gradient(
    135deg,
    rgba(255, 193, 7, 0.15) 0%,
    rgba(255, 152, 0, 0.15) 100%
  );
  border-color: rgba(255, 193, 7, 0.4);
}

.time-icon {
  font-size: 2.5rem;
  animation: pulse 2s ease-in-out infinite;
}

.time-box .info-value {
  background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: "Courier New", monospace;
}

/* Caja de jugador */
.player-box {
  background: linear-gradient(
    135deg,
    rgba(76, 175, 80, 0.15) 0%,
    rgba(69, 160, 73, 0.15) 100%
  );
  border-color: rgba(76, 175, 80, 0.4);
}

.player-icon {
  font-size: 2.5rem;
}

.player-box .info-value {
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Contenido principal */
.game-content {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 2rem;
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.1) 0%,
    rgba(118, 75, 162, 0.1) 100%
  );
  border-radius: 20px;
  padding: 2rem;
  border: 2px solid rgba(102, 126, 234, 0.3);
  backdrop-filter: blur(10px);
}

/* Área del ahorcado */
.hangman-area {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 1.5rem;
}

.hangman-svg {
  width: 100%;
  max-width: 250px;
  height: auto;
}

.hangman-part {
  animation: drawPart 0.5s ease-in;
}

@keyframes drawPart {
  from {
    opacity: 0;
    transform: scale(0);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Área de palabra */
.word-area {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.hint-box {
  background: linear-gradient(
    135deg,
    rgba(255, 193, 7, 0.2) 0%,
    rgba(255, 152, 0, 0.2) 100%
  );
  border-radius: 15px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 2px solid rgba(255, 193, 7, 0.3);
}

.hint-icon {
  font-size: 2rem;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.hint-text {
  font-size: 1.1rem;
  color: #ffd54f;
  font-weight: 600;
  line-height: 1.5;
}

.word-display {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  letter-spacing: 0.5rem;
  text-align: center;
  color: white;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Courier New", monospace;
}

.letters-used {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.letters-section {
  padding: 1rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  flex-wrap: wrap;
}

.correct-section {
  background: rgba(76, 175, 80, 0.2);
  border: 2px solid rgba(76, 175, 80, 0.4);
}

.wrong-section {
  background: rgba(244, 67, 54, 0.2);
  border: 2px solid rgba(244, 67, 54, 0.4);
}

.section-label {
  font-weight: 700;
  font-size: 1rem;
}

.correct-section .section-label {
  color: #4caf50;
}

.wrong-section .section-label {
  color: #f44336;
}

.letters-list {
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
}

/* Teclado */
.keyboard {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
  gap: 0.8rem;
  padding: 1.5rem;
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.1) 0%,
    rgba(118, 75, 162, 0.1) 100%
  );
  border-radius: 20px;
  border: 2px solid rgba(102, 126, 234, 0.3);
  backdrop-filter: blur(10px);
}

.key {
  padding: 1rem;
  font-size: 1.2rem;
  font-weight: 700;
  color: white;
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.3) 0%,
    rgba(118, 75, 162, 0.3) 100%
  );
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
}

.key:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.5) 0%,
    rgba(118, 75, 162, 0.5) 100%
  );
}

.key:active:not(:disabled) {
  transform: translateY(-1px);
}

.key.correct {
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  border-color: #4caf50;
  cursor: not-allowed;
}

.key.incorrect {
  background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
  border-color: #f44336;
  cursor: not-allowed;
}

.key:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Botones de navegación */
.game-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.game-btn {
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 700;
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.restart-btn {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.times-btn {
  background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
}

.level-btn {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.game-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
  padding: 1rem;
}

.modal-content {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 25px;
  padding: 2.5rem;
  max-width: 500px;
  width: 100%;
  border: 3px solid rgba(102, 126, 234, 0.5);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.4s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid rgba(102, 126, 234, 0.3);
}

.modal-header h2 {
  font-size: 2rem;
  font-weight: 800;
  margin: 0;
}

.modal-header.won h2 {
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.modal-header.lost h2 {
  background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.modal-message {
  font-size: 1.2rem;
  text-align: center;
  font-weight: 600;
  padding: 1rem;
  border-radius: 10px;
}

.modal-message.success {
  color: #4caf50;
  background: rgba(76, 175, 80, 0.2);
  border: 2px solid rgba(76, 175, 80, 0.4);
}

.modal-message.failure {
  color: #f44336;
  background: rgba(244, 67, 54, 0.2);
  border: 2px solid rgba(244, 67, 54, 0.4);
}

.modal-word {
  text-align: center;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  border: 2px solid rgba(102, 126, 234, 0.3);
}

.word-label {
  display: block;
  font-size: 0.9rem;
  color: #c6c6c6;
  margin-bottom: 0.5rem;
}

.word-value {
  display: block;
  font-size: 2rem;
  font-weight: 800;
  color: white;
  letter-spacing: 0.3rem;
}

.modal-stats {
  display: flex;
  justify-content: space-around;
  gap: 1rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  flex: 1;
  justify-content: center;
}

.stat-icon {
  font-size: 1.5rem;
}

.stat-text {
  font-size: 1rem;
  font-weight: 600;
  color: white;
}

.modal-footer {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.modal-btn {
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 700;
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.play-again-btn {
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
}

.times-btn {
  background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
}

.change-level-btn {
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
}

.home-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.modal-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
}

/* Responsive */
@media (max-width: 768px) {
  .game-header {
    grid-template-columns: 1fr;
  }

  .game-content {
    grid-template-columns: 1fr;
  }

  .hangman-svg {
    max-width: 200px;
  }

  .word-display {
    font-size: 1.5rem;
    letter-spacing: 0.3rem;
    padding: 1.5rem;
  }

  .keyboard {
    grid-template-columns: repeat(auto-fit, minmax(40px, 1fr));
    gap: 0.5rem;
    padding: 1rem;
  }

  .key {
    padding: 0.8rem;
    font-size: 1rem;
  }

  .game-buttons {
    flex-direction: column;
  }

  .game-btn {
    width: 100%;
  }

  .modal-content {
    padding: 1.5rem;
  }

  .modal-header h2 {
    font-size: 1.5rem;
  }

  .word-value {
    font-size: 1.5rem;
    letter-spacing: 0.2rem;
  }

  .modal-stats {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .info-box {
    padding: 1rem;
  }

  .info-icon {
    width: 40px;
    height: 40px;
  }

  .level-icon,
  .attempts-icon {
    font-size: 2rem;
  }

  .info-value {
    font-size: 1rem;
  }

  .hint-text {
    font-size: 0.95rem;
  }

  .keyboard {
    grid-template-columns: repeat(7, 1fr);
  }
}
</style>
