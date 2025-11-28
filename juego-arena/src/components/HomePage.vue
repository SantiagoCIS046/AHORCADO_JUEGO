<script setup>
const iniciarJuego = () => {
  console.log("Iniciando juego...");
  // Aquí se implementará la lógica para iniciar el juego
};
</script>

<template>
  <div class="home-container">
    <div class="content-wrapper">
      <h1 class="title">AHORCADO</h1>

      <div class="image-container">
        <img
          src="../assets/ahorcado.svg"
          alt="Ahorcado"
          class="hangman-image"
        />
      </div>

      <button class="start-button" @click="iniciarJuego">Iniciar Juego</button>
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
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
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

.start-button {
  padding: 1.2rem 3rem;
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.start-button::before {
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

.start-button:hover::before {
  left: 100%;
}

.start-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.6);
}

.start-button:active {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

/* Responsive */
@media (max-width: 768px) {
  .content-wrapper {
    gap: 2rem;
  }

  .title {
    font-size: clamp(2.5rem, 10vw, 4rem);
  }

  .image-container {
    max-width: 250px;
    padding: 1.5rem;
  }

  .start-button {
    padding: 1rem 2.5rem;
    font-size: 1.1rem;
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
