<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const playerName = ref("");
const showError = ref(false);
const currentPlayerName = ref("");

onMounted(() => {
  const savedName = localStorage.getItem("playerName");
  if (savedName) {
    currentPlayerName.value = savedName;
  }
});

const iniciarJuego = () => {
  if (!playerName.value.trim()) {
    showError.value = true;
    setTimeout(() => {
      showError.value = false;
    }, 3000);
    return;
  }

  // Guardar nombre del jugador
  localStorage.setItem("playerName", playerName.value.trim());
  console.log("Navegando a características...");
  router.push("/caracteristicas");
};

const verTiempos = () => {
  router.push("/tiempos");
};
</script>

<template>
  <div class="home-container">
    <div class="content-wrapper">
      <h1 class="title">AHORCADO</h1>

      <p class="description">
        <a class="texto">¡Bienvenido al juego del Ahorcado!</a>
        <br />Pon a prueba tu vocabulario y habilidades para adivinar palabras
        antes de que se complete el dibujo.
        <br />
        ¿Estás listo para el desafío?
      </p>

      <div class="image-container">
        <img
          src="../img/img_ahorcado.png"
          alt="Ahorcado"
          class="hangman-image"
        />
      </div>

      <!-- Mensaje de bienvenida si hay jugador registrado -->
      <div v-if="currentPlayerName" class="welcome-message">
        <span class="welcome-icon">👋</span>
        <span class="welcome-text">¡Hola, {{ currentPlayerName }}!</span>
      </div>

      <!-- Input para nombre del jugador -->
      <div class="player-input-container">
        <label for="playerName" class="input-label">
          <span class="label-icon">👤</span>
          Ingresa tu nombre:
        </label>
        <input
          id="playerName"
          v-model="playerName"
          type="text"
          class="player-input"
          placeholder="Tu nombre aquí..."
          maxlength="20"
          @keyup.enter="iniciarJuego"
        />
        <div v-if="showError" class="error-message">
          ⚠️ Por favor, ingresa tu nombre para continuar
        </div>
      </div>

      <div class="buttons-container">
        <button class="start-button" @click="iniciarJuego">
          Iniciar Juego
        </button>
        <button class="times-button" @click="verTiempos">⏱️ Ver Tiempos</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  max-width: 600px;
  width: 100%;
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

.texto {
  color: #c9c9c9bf;
  font-weight: bold;
}

.description {
  font-size: 1rem;
  font-weight: bold;
  text-align: center;
  color: #c6c6c662;
  line-height: 1.6;
  max-width: 500px;
}

.title {
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: 800;
  letter-spacing: 0.1em;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
  animation: titlePulse 2s ease-in-out infinite;
}

@keyframes titlePulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}

.image-container {
  width: 100%;
  max-width: 300px;
  padding: 2rem;
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.1) 0%,
    rgba(118, 75, 162, 0.1) 100%
  );
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.image-container:hover {
  transform: translateY(-10px);
  box-shadow: 0 12px 48px rgba(102, 126, 234, 0.2);
}

.hangman-image {
  width: 100%;
  height: auto;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  color: #667eea;
}

/* Mensaje de bienvenida */
.welcome-message {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem 2rem;
  background: linear-gradient(
    135deg,
    rgba(76, 175, 80, 0.2) 0%,
    rgba(69, 160, 73, 0.2) 100%
  );
  border-radius: 50px;
  border: 2px solid rgba(76, 175, 80, 0.4);
  animation: slideIn 0.5s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.welcome-icon {
  font-size: 1.5rem;
  animation: wave 1s ease-in-out infinite;
}

@keyframes wave {
  0%,
  100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(20deg);
  }
  75% {
    transform: rotate(-20deg);
  }
}

.welcome-text {
  font-size: 1.1rem;
  font-weight: 700;
  color: #4caf50;
}

/* Input del jugador */
.player-input-container {
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.input-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #c6c6c6;
}

.label-icon {
  font-size: 1.3rem;
}

.player-input {
  width: 100%;
  padding: 1rem 1.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(102, 126, 234, 0.3);
  border-radius: 50px;
  outline: none;
  transition: all 0.3s ease;
  text-align: center;
}

.player-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.player-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 20px rgba(102, 126, 234, 0.4);
  background: rgba(255, 255, 255, 0.15);
}

.error-message {
  padding: 0.8rem 1.2rem;
  background: rgba(244, 67, 54, 0.2);
  border: 2px solid rgba(244, 67, 54, 0.4);
  border-radius: 10px;
  color: #ff6b6b;
  font-size: 0.95rem;
  font-weight: 600;
  text-align: center;
  animation: shake 0.5s ease;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-10px);
  }
  75% {
    transform: translateX(10px);
  }
}

/* Contenedor de botones */
.buttons-container {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
}

.start-button,
.times-button {
  padding: 1.2rem 3rem;
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  flex: 1;
  min-width: 200px;
}

.start-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
}

.times-button {
  background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
  box-shadow: 0 8px 24px rgba(255, 193, 7, 0.4);
}

.start-button::before,
.times-button::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: left 0.5s ease;
}

.start-button:hover::before,
.times-button:hover::before {
  left: 100%;
}

.start-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.6);
}

.times-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(255, 193, 7, 0.6);
}

.start-button:active,
.times-button:active {
  transform: translateY(-1px);
}

/* Responsive */
@media (max-width: 768px) {
  .content-wrapper {
    gap: 1.5rem;
  }

  .title {
    font-size: clamp(2.5rem, 10vw, 4rem);
  }

  .image-container {
    max-width: 250px;
    padding: 1.5rem;
  }

  .buttons-container {
    flex-direction: column;
    width: 100%;
  }

  .start-button,
  .times-button {
    padding: 1rem 2rem;
    font-size: 1.1rem;
    width: 100%;
  }

  .player-input {
    font-size: 1rem;
  }
}

/* Tema claro */
@media (prefers-color-scheme: light) {
  .image-container {
    background: linear-gradient(
      135deg,
      rgba(102, 126, 234, 0.15) 0%,
      rgba(118, 75, 162, 0.15) 100%
    );
    border: 1px solid rgba(102, 126, 234, 0.2);
  }

  .hangman-image {
    color: #5a67d8;
  }
}
</style>
