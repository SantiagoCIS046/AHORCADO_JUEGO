<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const volverInicio = () => {
  router.push("/");
};
</script>

<template>
  <div class="caracteristicas-container">
    <div class="content-wrapper">
      <h1 class="title">CARACTERÍSTICAS</h1>

      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">🎮</div>
          <h3>Juego Interactivo</h3>
          <p>Disfruta de una experiencia de juego fluida y entretenida</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">📚</div>
          <h3>Múltiples Categorías</h3>
          <p>Palabras de diferentes temas para ampliar tu vocabulario</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">⏱️</div>
          <h3>Diferentes Niveles</h3>
          <p>Desde principiante hasta experto, elige tu desafío</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">🏆</div>
          <h3>Sistema de Puntuación</h3>
          <p>Compite contigo mismo y mejora tu récord</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">🎨</div>
          <h3>Diseño Moderno</h3>
          <p>Interfaz atractiva y fácil de usar</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">💡</div>
          <h3>Pistas Disponibles</h3>
          <p>Obtén ayuda cuando la necesites</p>
        </div>
      </div>

      <button class="back-button" @click="volverInicio">
        ← Volver al Inicio
      </button>
    </div>
  </div>
</template>

<style scoped>
.caracteristicas-container {
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
  max-width: 1200px;
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
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 800;
  letter-spacing: 0.1em;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  width: 100%;
  margin: 2rem 0;
}

.feature-card {
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.1) 0%,
    rgba(118, 75, 162, 0.1) 100%
  );
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 12px 48px rgba(102, 126, 234, 0.2);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.feature-card h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.feature-card p {
  font-size: 1rem;
  color: #c6c6c662;
  line-height: 1.6;
}

.back-button {
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 0.05em;
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

.back-button::before {
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

.back-button:hover::before {
  left: 100%;
}

.back-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.6);
}

.back-button:active {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

/* Responsive */
@media (max-width: 768px) {
  .features-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .feature-card {
    padding: 1.5rem;
  }

  .back-button {
    padding: 0.9rem 2rem;
    font-size: 1rem;
  }
}

/* Tema claro */
@media (prefers-color-scheme: light) {
  .feature-card {
    background: linear-gradient(
      135deg,
      rgba(102, 126, 234, 0.15) 0%,
      rgba(118, 75, 162, 0.15) 100%
    );
    border: 1px solid rgba(102, 126, 234, 0.2);
  }
}
</style>
