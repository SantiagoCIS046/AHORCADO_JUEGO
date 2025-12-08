<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

// Importar imágenes de categorías
import iconPelota from "../icon/icon-pelota.png";
import iconManzana from "../icon/icon-manzana.png";
import iconPlanetaTierra from "../icon/icon-PlanetaTierra.png";
import iconLeon from "../icon/icon-leon.png";
import iconPalomitas from "../icon/icon-palomitas.png";
import iconCiencias from "../icon/icon-ciencias.png";

const router = useRouter();
const selectedCategory = ref(null);
const showAlert = ref(false);
const alertMessage = ref("");

const volverInicio = () => {
  router.push("/");
};

const selectCategory = (category, categoryName) => {
  selectedCategory.value = category;

  // Guardar en localStorage
  localStorage.setItem("selectedCategory", category);
  localStorage.setItem("selectedCategoryName", categoryName);

  alertMessage.value = `¡Característica "${categoryName}" registrada exitosamente!`;
  showAlert.value = true;

  // Navegar automáticamente a niveles después de 1 segundo
  setTimeout(() => {
    router.push("/niveles");
  }, 1000);
};
</script>

<template>
  <div class="caracteristicas-container">
    <div class="content-wrapper">
      <h1 class="title">CARACTERÍSTICAS</h1>

      <!-- Alerta de Bootstrap -->
      <div
        v-if="showAlert"
        class="alert alert-success alert-dismissible fade show custom-alert"
        role="alert"
      >
        <strong>✓</strong> {{ alertMessage }}
        <button
          type="button"
          class="btn-close"
          @click="showAlert = false"
          aria-label="Close"
        ></button>
      </div>

      <div class="features-grid">
        <div
          class="feature-card card-deportes"
          :class="{ selected: selectedCategory === 'deportes' }"
          @click="selectCategory('deportes', 'Diversión Deportiva')"
        >
          <div class="feature-icon">
            <img :src="iconPelota" alt="Diversión Deportiva" />
          </div>
          <h3>Diversión Deportiva</h3>
          <p>
            Juega y aprende con palabras relacionadas al deporte y la actividad
            física
          </p>
        </div>

        <div
          class="feature-card card-alimentacion"
          :class="{ selected: selectedCategory === 'alimentacion' }"
          @click="selectCategory('alimentacion', 'Alimentación Saludable')"
        >
          <div class="feature-icon">
            <img :src="iconManzana" alt="Alimentación Saludable" />
          </div>
          <h3>Alimentación Saludable</h3>
          <p>Descubre palabras sobre frutas, verduras y nutrición balanceada</p>
        </div>

        <div
          class="feature-card card-geografia"
          :class="{ selected: selectedCategory === 'geografia' }"
          @click="selectCategory('geografia', 'Mundo y Geografía')"
        >
          <div class="feature-icon">
            <img :src="iconPlanetaTierra" alt="Mundo y Geografía" />
          </div>
          <h3>Mundo y Geografía</h3>
          <p>Explora países, continentes y maravillas naturales del planeta</p>
        </div>

        <div
          class="feature-card card-animales"
          :class="{ selected: selectedCategory === 'animales' }"
          @click="selectCategory('animales', 'Reino Animal')"
        >
          <div class="feature-icon">
            <img :src="iconLeon" alt="Reino Animal" />
          </div>
          <h3>Reino Animal</h3>
          <p>Conoce la fauna salvaje y doméstica de todo el mundo</p>
        </div>

        <div
          class="feature-card card-entretenimiento"
          :class="{ selected: selectedCategory === 'entretenimiento' }"
          @click="selectCategory('entretenimiento', 'Entretenimiento')"
        >
          <div class="feature-icon">
            <img :src="iconPalomitas" alt="Entretenimiento" />
          </div>
          <h3>Entretenimiento</h3>
          <p>Disfruta de palabras sobre cine, series y cultura popular</p>
        </div>

        <div
          class="feature-card card-ciencia"
          :class="{ selected: selectedCategory === 'ciencia' }"
          @click="selectCategory('ciencia', 'Ciencia y Tecnología')"
        >
          <div class="feature-icon">
            <img :src="iconCiencias" alt="Ciencia y Tecnología" />
          </div>
          <h3>Ciencia y Tecnología</h3>
          <p>Aprende términos científicos y avances tecnológicos modernos</p>
        </div>
      </div>

      <div class="buttons-container">
        <button class="back-button" @click="volverInicio">
          ← Volver al Inicio
        </button>

        <button class="select-level-button" @click="router.push('/niveles')">
          Seleccionar Nivel
        </button>
      </div>
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
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
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
  transition: transform 0.3s ease, box-shadow 0.3s ease, border 0.3s ease;
  cursor: pointer;
}

.feature-card.selected {
  border: 3px solid #4caf50;
  transform: scale(1.05);
  box-shadow: 0 15px 50px rgba(76, 175, 80, 0.5);
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 12px 48px rgba(102, 126, 234, 0.2);
}

.custom-alert {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  min-width: 300px;
  animation: slideIn 0.3s ease-out;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.feature-icon {
  margin-bottom: 1rem;
  animation: bounce 2s ease-in-out infinite;
  display: flex;
  justify-content: center;
  align-items: center;
}

.feature-icon img {
  width: 80px;
  height: 80px;
  object-fit: contain;
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

.buttons-container {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.select-level-button {
  padding: 1.2rem 3rem;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: white;
  background: linear-gradient(135deg, #2dd032 0%, #212120 100%);
  border: none;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: -5px 5px 24px rgba(4, 239, 12, 0.4);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.select-level-button::before {
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

.select-level-button:hover::before {
  left: 100%;
}

.select-level-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(76, 175, 80, 0.6);
}

.select-level-button:active {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(76, 175, 80, 0.4);
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

  .buttons-container {
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }

  .select-level-button {
    padding: 1rem 2.5rem;
    font-size: 1.1rem;
    width: 100%;
  }

  .back-button {
    padding: 0.9rem 2rem;
    font-size: 1rem;
    width: 100%;
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
