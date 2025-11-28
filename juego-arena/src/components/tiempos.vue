<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const volverInicio = () => {
  router.push("/");
};
</script>

<template>
  <div class="tiempos-container">
    <div class="content-wrapper">
      <h1 class="title">TIEMPOS</h1>
      <p class="description">Configuración de tiempos en desarrollo...</p>
      <button class="back-button" @click="volverInicio">
        ← Volver al Inicio
      </button>
    </div>
  </div>
</template>

<style scoped>
.tiempos-container {
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
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  letter-spacing: 0.1em;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.description {
  font-size: 1.2rem;
  color: #c6c6c662;
  text-align: center;
}

.back-button {
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.6);
}
</style>
