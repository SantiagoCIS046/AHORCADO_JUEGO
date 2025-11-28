<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// Estado para la categoría seleccionada
const selectedCategory = ref(null);
const selectedCategoryName = ref(null);
const showCategoryModal = ref(false);

// Mapeo de categorías con sus iconos
const categoryIcons = {
  deportes: "/src/icon/icon-pelota.png",
  alimentacion: "/src/icon/icon-manzana.png",
  geografia: "/src/icon/icon-PlanetaTierra.png",
  animales: "/src/icon/icon-leon.png",
  entretenimiento: "/src/icon/icon-palomitas.png",
  ciencia: "/src/icon/icon-ciencias.png",
};

const categoryNames = {
  deportes: "Diversión Deportiva",
  alimentacion: "Alimentación Saludable",
  geografia: "Mundo y Geografía",
  animales: "Reino Animal",
  entretenimiento: "Entretenimiento",
  ciencia: "Ciencia y Tecnología",
};

// Definición de niveles
const levels = [
  {
    id: "facil",
    name: "FÁCIL",
    icon: "/src/ico/ico-facil.png",
    words: "4-6 palabras",
    attempts: 8,
    color: "#4caf50",
    gradient: "linear-gradient(135deg, #4caf50 0%, #45a049 100%)",
  },
  {
    id: "medio",
    name: "MEDIO",
    icon: "/src/ico/ico-medio.png",
    words: "7-9 palabras",
    attempts: 6,
    color: "#ff9800",
    gradient: "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)",
  },
  {
    id: "dificil",
    name: "DIFÍCIL",
    icon: "/src/ico/ico-dificil.png",
    words: "10+ palabras",
    attempts: 5,
    color: "#f44336",
    gradient: "linear-gradient(135deg, #f44336 0%, #d32f2f 100%)",
  },
];

// Cargar categoría seleccionada al montar el componente
onMounted(() => {
  const category = localStorage.getItem("selectedCategory");
  const categoryName = localStorage.getItem("selectedCategoryName");

  if (category && categoryName) {
    selectedCategory.value = category;
    selectedCategoryName.value = categoryName;
  }
});

// Computed para obtener el icono de la categoría actual
const currentCategoryIcon = computed(() => {
  return selectedCategory.value
    ? categoryIcons[selectedCategory.value]
    : "/src/icon/icon-pelota.png";
});

// Función para volver al inicio
const volverInicio = () => {
  router.push("/");
};

// Función para volver a características
const volverCaracteristicas = () => {
  router.push("/caracteristicas");
};

// Función para seleccionar nivel y navegar al juego
const selectLevel = (level) => {
  if (!selectedCategory.value) {
    alert("Por favor, selecciona una característica primero");
    router.push("/caracteristicas");
    return;
  }

  // Guardar nivel seleccionado en localStorage
  localStorage.setItem("selectedLevel", level.id);
  localStorage.setItem("selectedLevelName", level.name);
  localStorage.setItem("selectedLevelAttempts", level.attempts);

  // Navegar al juego
  router.push("/juego");
};

// Función para abrir modal de cambio de categoría
const openCategoryModal = () => {
  showCategoryModal.value = true;
};

// Función para cerrar modal
const closeCategoryModal = () => {
  showCategoryModal.value = false;
};

// Función para cambiar categoría
const changeCategory = (category, categoryName) => {
  selectedCategory.value = category;
  selectedCategoryName.value = categoryName;

  // Actualizar localStorage
  localStorage.setItem("selectedCategory", category);
  localStorage.setItem("selectedCategoryName", categoryName);

  closeCategoryModal();
};
</script>

<template>
  <div class="niveles-container">
    <div class="content-wrapper">
      <h1 class="title">SELECCIONA TU NIVEL</h1>

      <!-- Cuadro de característica seleccionada -->
      <div class="selected-category-box" v-if="selectedCategory">
        <div class="category-info">
          <img
            :src="currentCategoryIcon"
            alt="Categoría"
            class="category-icon"
          />
          <div class="category-text">
            <h3>Característica Seleccionada:</h3>
            <p>{{ selectedCategoryName }}</p>
          </div>
        </div>
        <button class="change-button" @click="openCategoryModal">
          🔄 Cambiar
        </button>
      </div>

      <!-- Mensaje si no hay categoría seleccionada -->
      <div class="no-category-box" v-else>
        <p>⚠️ No has seleccionado ninguna característica</p>
        <button class="select-category-button" @click="volverCaracteristicas">
          Seleccionar Característica
        </button>
      </div>

      <!-- Grid de niveles -->
      <div class="levels-grid">
        <div
          v-for="level in levels"
          :key="level.id"
          class="level-card"
          @click="selectLevel(level)"
          :style="{ '--level-color': level.color }"
        >
          <div class="level-icon">
            <img :src="level.icon" :alt="level.name" />
          </div>
          <h2 class="level-name">{{ level.name }}</h2>
          <div class="level-details">
            <div class="detail-item">
              <span class="detail-icon">📝</span>
              <span class="detail-text">{{ level.words }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-icon">🎯</span>
              <span class="detail-text">{{ level.attempts }} intentos</span>
            </div>
          </div>
          <div class="play-button">
            <span>JUGAR</span>
            <span class="arrow">→</span>
          </div>
        </div>
      </div>

      <!-- Botón volver -->
      <button class="back-button" @click="volverInicio">
        ← Volver al Inicio
      </button>
    </div>

    <!-- Modal para cambiar categoría -->
    <div
      v-if="showCategoryModal"
      class="modal-overlay"
      @click="closeCategoryModal"
    >
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Cambiar Característica</h2>
          <button class="close-modal" @click="closeCategoryModal">✕</button>
        </div>
        <div class="modal-body">
          <div
            v-for="(name, key) in categoryNames"
            :key="key"
            class="category-option"
            :class="{ active: selectedCategory === key }"
            @click="changeCategory(key, name)"
          >
            <img :src="categoryIcons[key]" :alt="name" class="option-icon" />
            <span class="option-name">{{ name }}</span>
            <span v-if="selectedCategory === key" class="check-icon">✓</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.niveles-container {
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
  gap: 2.5rem;
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
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  letter-spacing: 0.1em;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
}

/* Cuadro de categoría seleccionada */
.selected-category-box {
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.15) 0%,
    rgba(118, 75, 162, 0.15) 100%
  );
  border-radius: 20px;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  width: 100%;
  max-width: 600px;
  border: 2px solid rgba(102, 126, 234, 0.3);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  animation: slideDown 0.5s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.category-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex: 1;
}

.category-icon {
  width: 60px;
  height: 60px;
  object-fit: contain;
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

.category-text h3 {
  font-size: 0.9rem;
  color: #c6c6c6;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
}

.category-text p {
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.change-button {
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.change-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

/* Mensaje sin categoría */
.no-category-box {
  background: linear-gradient(
    135deg,
    rgba(244, 67, 54, 0.15) 0%,
    rgba(211, 47, 47, 0.15) 100%
  );
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  width: 100%;
  max-width: 600px;
  border: 2px solid rgba(244, 67, 54, 0.3);
  backdrop-filter: blur(10px);
}

.no-category-box p {
  font-size: 1.2rem;
  color: #ff6b6b;
  margin: 0 0 1.5rem 0;
  font-weight: 600;
}

.select-category-button {
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.select-category-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(244, 67, 54, 0.4);
}

/* Grid de niveles */
.levels-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  width: 100%;
  margin: 1rem 0;
}

.level-card {
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.1) 0%,
    rgba(118, 75, 162, 0.1) 100%
  );
  border-radius: 25px;
  padding: 2.5rem 2rem;
  text-align: center;
  border: 2px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
}

.level-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--level-color);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 0;
}

.level-card:hover::before {
  opacity: 0.1;
}

.level-card:hover {
  transform: translateY(-15px) scale(1.05);
  border-color: var(--level-color);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3), 0 0 40px var(--level-color);
}

.level-card > * {
  position: relative;
  z-index: 1;
}

.level-icon {
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.level-icon img {
  width: 100px;
  height: 100px;
  object-fit: contain;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  transition: transform 0.3s ease;
}

.level-card:hover .level-icon img {
  transform: scale(1.1) rotate(5deg);
}

.level-name {
  font-size: 2rem;
  font-weight: 800;
  margin: 0 0 1.5rem 0;
  color: white;
  letter-spacing: 0.05em;
}

.level-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.detail-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  font-size: 1.1rem;
  color: #c6c6c6;
}

.detail-icon {
  font-size: 1.5rem;
}

.detail-text {
  font-weight: 600;
}

.play-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: var(--level-color);
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 700;
  color: white;
  transition: all 0.3s ease;
}

.level-card:hover .play-button {
  gap: 1rem;
  padding: 1rem 2.5rem;
}

.arrow {
  font-size: 1.3rem;
  transition: transform 0.3s ease;
}

.level-card:hover .arrow {
  transform: translateX(5px);
}

/* Botón volver */
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
  margin-top: 1rem;
}

.back-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.6);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
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
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  border: 2px solid rgba(102, 126, 234, 0.3);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(102, 126, 234, 0.3);
}

.modal-header h2 {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.close-modal {
  background: none;
  border: none;
  font-size: 2rem;
  color: #c6c6c6;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.close-modal:hover {
  background: rgba(244, 67, 54, 0.2);
  color: #f44336;
  transform: rotate(90deg);
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.category-option {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.1) 0%,
    rgba(118, 75, 162, 0.1) 100%
  );
  border-radius: 15px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-option:hover {
  transform: translateX(10px);
  border-color: rgba(102, 126, 234, 0.5);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.2);
}

.category-option.active {
  border-color: #4caf50;
  background: linear-gradient(
    135deg,
    rgba(76, 175, 80, 0.2) 0%,
    rgba(69, 160, 73, 0.2) 100%
  );
}

.option-icon {
  width: 50px;
  height: 50px;
  object-fit: contain;
}

.option-name {
  flex: 1;
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
}

.check-icon {
  font-size: 1.5rem;
  color: #4caf50;
  font-weight: bold;
}

/* Responsive */
@media (max-width: 768px) {
  .levels-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .selected-category-box {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .category-info {
    flex-direction: column;
    text-align: center;
  }

  .level-card {
    padding: 2rem 1.5rem;
  }

  .modal-content {
    padding: 1.5rem;
  }

  .category-option {
    padding: 1rem;
  }
}

/* Scrollbar personalizado para el modal */
.modal-content::-webkit-scrollbar {
  width: 8px;
}

.modal-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.modal-content::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}
</style>
