<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const gameHistory = ref([]);
const filterCategory = ref("all");
const filterLevel = ref("all");
const showClearModal = ref(false);

// Iconos de categorías
const categoryIcons = {
  deportes: "/src/icon/icon-pelota.png",
  alimentacion: "/src/icon/icon-manzana.png",
  geografia: "/src/icon/icon-PlanetaTierra.png",
  animales: "/src/icon/icon-leon.png",
  entretenimiento: "/src/icon/icon-palomitas.png",
  ciencia: "/src/icon/icon-ciencias.png",
};

// Cargar historial de juegos
onMounted(() => {
  loadGameHistory();
});

const loadGameHistory = () => {
  const history = localStorage.getItem("gameHistory");
  if (history) {
    gameHistory.value = JSON.parse(history);
  }
};

// Computed: Solo juegos ganados
const wonGames = computed(() => {
  return gameHistory.value.filter((game) => game.won);
});

// Computed: Juegos filtrados
const filteredGames = computed(() => {
  let games = wonGames.value;

  if (filterCategory.value !== "all") {
    games = games.filter((game) => game.category === filterCategory.value);
  }

  if (filterLevel.value !== "all") {
    games = games.filter((game) => game.level === filterLevel.value);
  }

  return games.sort((a, b) => a.time - b.time);
});

// Computed: Top 3 jugadores
const topThree = computed(() => {
  return filteredGames.value.slice(0, 3);
});

// Computed: Resto de jugadores (después del top 3)
const restOfPlayers = computed(() => {
  return filteredGames.value.slice(3);
});

// Computed: Estadísticas
const stats = computed(() => {
  const total = gameHistory.value.length;
  const wins = wonGames.value.length;
  const losses = total - wins;
  const avgTime =
    wonGames.value.length > 0
      ? Math.round(
          wonGames.value.reduce((sum, game) => sum + game.time, 0) /
            wonGames.value.length
        )
      : 0;

  return {
    total,
    wins,
    losses,
    avgTime,
    winRate: total > 0 ? Math.round((wins / total) * 100) : 0,
  };
});

// Función para formatear tiempo
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

// Función para obtener clase de medalla
const getMedalClass = (index) => {
  if (index === 0) return "gold";
  if (index === 1) return "silver";
  if (index === 2) return "bronze";
  return "";
};

// Función para obtener emoji de medalla
const getMedalEmoji = (index) => {
  if (index === 0) return "🥇";
  if (index === 1) return "🥈";
  if (index === 2) return "🥉";
  return "";
};

// Función para limpiar historial
const clearHistory = () => {
  localStorage.removeItem("gameHistory");
  gameHistory.value = [];
  showClearModal.value = false;
};

// Función para volver al inicio
const volverInicio = () => {
  router.push("/");
};

// Categorías únicas del historial
const availableCategories = computed(() => {
  const categories = new Set(wonGames.value.map((game) => game.category));
  return Array.from(categories);
});

// Niveles únicos del historial
const availableLevels = computed(() => {
  const levels = new Set(wonGames.value.map((game) => game.level));
  return Array.from(levels);
});
</script>

<template>
  <div class="tiempos-container">
    <div class="content-wrapper">
      <!-- Título -->
      <h1 class="title">⏱️ TABLA DE TIEMPOS</h1>

      <!-- Estadísticas generales -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">🎮</div>
          <div class="stat-info">
            <span class="stat-label">Total Juegos</span>
            <span class="stat-value">{{ stats.total }}</span>
          </div>
        </div>
        <div class="stat-card wins">
          <div class="stat-icon">✅</div>
          <div class="stat-info">
            <span class="stat-label">Victorias</span>
            <span class="stat-value">{{ stats.wins }}</span>
          </div>
        </div>
        <div class="stat-card losses">
          <div class="stat-icon">❌</div>
          <div class="stat-info">
            <span class="stat-label">Derrotas</span>
            <span class="stat-value">{{ stats.losses }}</span>
          </div>
        </div>
        <div class="stat-card average">
          <div class="stat-icon">⏱️</div>
          <div class="stat-info">
            <span class="stat-label">Tiempo Promedio</span>
            <span class="stat-value">{{ formatTime(stats.avgTime) }}</span>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="filters-section" v-if="wonGames.length > 0">
        <div class="filter-group">
          <label class="filter-label">
            <span class="filter-icon">🎯</span>
            Categoría:
          </label>
          <select v-model="filterCategory" class="filter-select">
            <option value="all">Todas</option>
            <option v-for="cat in availableCategories" :key="cat" :value="cat">
              {{ cat.charAt(0).toUpperCase() + cat.slice(1).replace("_", " ") }}
            </option>
          </select>
        </div>
        <div class="filter-group">
          <label class="filter-label">
            <span class="filter-icon">📊</span>
            Nivel:
          </label>
          <select v-model="filterLevel" class="filter-select">
            <option value="all">Todos</option>
            <option v-for="lvl in availableLevels" :key="lvl" :value="lvl">
              {{ lvl.charAt(0).toUpperCase() + lvl.slice(1) }}
            </option>
          </select>
        </div>
      </div>

      <!-- Podio Top 3 -->
      <div v-if="topThree.length > 0" class="podium-section">
        <h2 class="section-title">🏆 PODIO DE CAMPEONES</h2>
        <div class="podium-container">
          <!-- Segundo lugar -->
          <div
            v-if="topThree[1]"
            class="podium-place second"
            :class="getMedalClass(1)"
          >
            <div class="medal">{{ getMedalEmoji(1) }}</div>
            <div class="podium-rank">2°</div>
            <div class="player-avatar">
              <span class="avatar-text">{{
                topThree[1].playerName.charAt(0).toUpperCase()
              }}</span>
            </div>
            <div class="player-name">{{ topThree[1].playerName }}</div>
            <div class="player-time">{{ formatTime(topThree[1].time) }}</div>
            <div class="player-details">
              <img
                :src="categoryIcons[topThree[1].category]"
                :alt="topThree[1].categoryName"
                class="detail-icon"
              />
              <span class="detail-text">{{ topThree[1].levelName }}</span>
            </div>
            <div class="player-date">{{ topThree[1].date }}</div>
          </div>

          <!-- Primer lugar -->
          <div
            v-if="topThree[0]"
            class="podium-place first"
            :class="getMedalClass(0)"
          >
            <div class="crown">👑</div>
            <div class="medal">{{ getMedalEmoji(0) }}</div>
            <div class="podium-rank">1°</div>
            <div class="player-avatar champion">
              <span class="avatar-text">{{
                topThree[0].playerName.charAt(0).toUpperCase()
              }}</span>
            </div>
            <div class="player-name">{{ topThree[0].playerName }}</div>
            <div class="player-time champion-time">
              {{ formatTime(topThree[0].time) }}
            </div>
            <div class="player-details">
              <img
                :src="categoryIcons[topThree[0].category]"
                :alt="topThree[0].categoryName"
                class="detail-icon"
              />
              <span class="detail-text">{{ topThree[0].levelName }}</span>
            </div>
            <div class="player-date">{{ topThree[0].date }}</div>
          </div>

          <!-- Tercer lugar -->
          <div
            v-if="topThree[2]"
            class="podium-place third"
            :class="getMedalClass(2)"
          >
            <div class="medal">{{ getMedalEmoji(2) }}</div>
            <div class="podium-rank">3°</div>
            <div class="player-avatar">
              <span class="avatar-text">{{
                topThree[2].playerName.charAt(0).toUpperCase()
              }}</span>
            </div>
            <div class="player-name">{{ topThree[2].playerName }}</div>
            <div class="player-time">{{ formatTime(topThree[2].time) }}</div>
            <div class="player-details">
              <img
                :src="categoryIcons[topThree[2].category]"
                :alt="topThree[2].categoryName"
                class="detail-icon"
              />
              <span class="detail-text">{{ topThree[2].levelName }}</span>
            </div>
            <div class="player-date">{{ topThree[2].date }}</div>
          </div>
        </div>
      </div>

      <!-- Tabla de registros completa -->
      <div v-if="filteredGames.length > 0" class="records-section">
        <h2 class="section-title">📋 REGISTRO COMPLETO</h2>
        <div class="table-container">
          <table class="records-table">
            <thead>
              <tr>
                <th>Posición</th>
                <th>Jugador</th>
                <th>Tiempo</th>
                <th>Categoría</th>
                <th>Nivel</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(game, index) in filteredGames"
                :key="game.id"
                :class="{ 'top-three': index < 3 }"
              >
                <td class="position-cell">
                  <span class="position-badge" :class="getMedalClass(index)">
                    {{ index < 3 ? getMedalEmoji(index) : index + 1 }}
                  </span>
                </td>
                <td class="player-cell">
                  <div class="player-info">
                    <div class="mini-avatar">
                      {{ game.playerName.charAt(0).toUpperCase() }}
                    </div>
                    <span class="player-name-text">{{ game.playerName }}</span>
                  </div>
                </td>
                <td class="time-cell">
                  <span class="time-badge">{{ formatTime(game.time) }}</span>
                </td>
                <td class="category-cell">
                  <div class="category-info">
                    <img
                      :src="categoryIcons[game.category]"
                      :alt="game.categoryName"
                      class="category-icon"
                    />
                    <span class="category-name">{{ game.categoryName }}</span>
                  </div>
                </td>
                <td class="level-cell">
                  <span class="level-badge" :class="game.level">{{
                    game.levelName
                  }}</span>
                </td>
                <td class="date-cell">{{ game.date }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Mensaje si no hay registros -->
      <div v-else class="no-records">
        <div class="no-records-icon">🎮</div>
        <h3>No hay registros disponibles</h3>
        <p>¡Comienza a jugar para aparecer en la tabla de tiempos!</p>
      </div>

      <!-- Botones de acción -->
      <div class="action-buttons">
        <button class="action-btn back-btn" @click="volverInicio">
          ← Volver al Inicio
        </button>
        <button
          v-if="gameHistory.length > 0"
          class="action-btn clear-btn"
          @click="showClearModal = true"
        >
          🗑️ Limpiar Historial
        </button>
      </div>
    </div>

    <!-- Modal de confirmación para limpiar historial -->
    <div
      v-if="showClearModal"
      class="modal-overlay"
      @click="showClearModal = false"
    >
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>⚠️ Confirmar Acción</h2>
        </div>
        <div class="modal-body">
          <p>
            ¿Estás seguro de que deseas eliminar todo el historial de juegos?
          </p>
          <p class="warning-text">Esta acción no se puede deshacer.</p>
        </div>
        <div class="modal-footer">
          <button class="modal-btn cancel-btn" @click="showClearModal = false">
            Cancelar
          </button>
          <button class="modal-btn confirm-btn" @click="clearHistory">
            Sí, Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tiempos-container {
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}

.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
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
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
}

/* Estadísticas */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.15) 0%,
    rgba(118, 75, 162, 0.15) 100%
  );
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  border: 2px solid rgba(102, 126, 234, 0.3);
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-card.wins {
  background: linear-gradient(
    135deg,
    rgba(76, 175, 80, 0.15) 0%,
    rgba(69, 160, 73, 0.15) 100%
  );
  border-color: rgba(76, 175, 80, 0.4);
}

.stat-card.losses {
  background: linear-gradient(
    135deg,
    rgba(244, 67, 54, 0.15) 0%,
    rgba(211, 47, 47, 0.15) 100%
  );
  border-color: rgba(244, 67, 54, 0.4);
}

.stat-card.average {
  background: linear-gradient(
    135deg,
    rgba(255, 193, 7, 0.15) 0%,
    rgba(255, 152, 0, 0.15) 100%
  );
  border-color: rgba(255, 193, 7, 0.4);
}

.stat-icon {
  font-size: 3rem;
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #c6c6c6;
  font-weight: 600;
}

.stat-value {
  font-size: 2rem;
  font-weight: 800;
  color: white;
}

/* Filtros */
.filters-section {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
  padding: 1.5rem;
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.1) 0%,
    rgba(118, 75, 162, 0.1) 100%
  );
  border-radius: 20px;
  border: 2px solid rgba(102, 126, 234, 0.3);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
}

.filter-icon {
  font-size: 1.3rem;
}

.filter-select {
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(102, 126, 234, 0.3);
  border-radius: 50px;
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-select:hover,
.filter-select:focus {
  border-color: #667eea;
  background: rgba(255, 255, 255, 0.15);
}

.filter-select option {
  background: #1a1a2e;
  color: white;
}

/* Sección de títulos */
.section-title {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin: 0;
  color: white;
}

/* Podio */
.podium-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.podium-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  align-items: end;
  max-width: 1000px;
  margin: 0 auto;
  width: 100%;
}

.podium-place {
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.15) 0%,
    rgba(118, 75, 162, 0.15) 100%
  );
  border-radius: 25px;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  border: 3px solid rgba(102, 126, 234, 0.3);
  backdrop-filter: blur(10px);
  position: relative;
  transition: transform 0.3s ease;
  animation: slideUp 0.6s ease-out;
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

.podium-place:hover {
  transform: translateY(-10px);
}

.podium-place.first {
  grid-column: 2;
  background: linear-gradient(
    135deg,
    rgba(255, 215, 0, 0.2) 0%,
    rgba(255, 193, 7, 0.2) 100%
  );
  border-color: #ffd700;
  border-width: 4px;
  padding: 2.5rem 2rem;
  box-shadow: 0 0 40px rgba(255, 215, 0, 0.4);
}

.podium-place.second {
  grid-column: 1;
  background: linear-gradient(
    135deg,
    rgba(192, 192, 192, 0.2) 0%,
    rgba(169, 169, 169, 0.2) 100%
  );
  border-color: #c0c0c0;
}

.podium-place.third {
  grid-column: 3;
  background: linear-gradient(
    135deg,
    rgba(205, 127, 50, 0.2) 0%,
    rgba(184, 115, 51, 0.2) 100%
  );
  border-color: #cd7f32;
}

.crown {
  font-size: 3rem;
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

.medal {
  font-size: 3.5rem;
  animation: rotate 3s ease-in-out infinite;
}

@keyframes rotate {
  0%,
  100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(15deg);
  }
}

.podium-rank {
  font-size: 1.5rem;
  font-weight: 800;
  color: white;
}

.player-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid rgba(255, 255, 255, 0.3);
}

.player-avatar.champion {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  border-color: #ffd700;
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.6);
}

.avatar-text {
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
}

.player-name {
  font-size: 1.3rem;
  font-weight: 700;
  color: white;
  text-align: center;
}

.player-time {
  font-size: 1.8rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: "Courier New", monospace;
}

.champion-time {
  font-size: 2.2rem;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.player-details {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50px;
}

.detail-icon {
  width: 25px;
  height: 25px;
  object-fit: contain;
}

.detail-text {
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
}

.player-date {
  font-size: 0.85rem;
  color: #c6c6c6;
}

/* Tabla de registros */
.records-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.table-container {
  overflow-x: auto;
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.1) 0%,
    rgba(118, 75, 162, 0.1) 100%
  );
  border-radius: 20px;
  border: 2px solid rgba(102, 126, 234, 0.3);
  backdrop-filter: blur(10px);
}

.records-table {
  width: 100%;
  border-collapse: collapse;
}

.records-table thead {
  background: rgba(102, 126, 234, 0.2);
}

.records-table th {
  padding: 1.5rem 1rem;
  text-align: left;
  font-size: 1rem;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.records-table tbody tr {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: background 0.3s ease;
}

.records-table tbody tr:hover {
  background: rgba(102, 126, 234, 0.15);
}

.records-table tbody tr.top-three {
  background: rgba(255, 215, 0, 0.1);
}

.records-table td {
  padding: 1.2rem 1rem;
  color: white;
}

.position-cell {
  text-align: center;
}

.position-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  padding: 0.5rem;
  border-radius: 50%;
  background: rgba(102, 126, 234, 0.3);
  font-weight: 700;
  font-size: 1.1rem;
}

.position-badge.gold {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
}

.position-badge.silver {
  background: linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%);
  box-shadow: 0 0 20px rgba(192, 192, 192, 0.5);
}

.position-badge.bronze {
  background: linear-gradient(135deg, #cd7f32 0%, #e8a87c 100%);
  box-shadow: 0 0 20px rgba(205, 127, 50, 0.5);
}

.player-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.mini-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.2rem;
  color: white;
}

.player-name-text {
  font-weight: 600;
}

.time-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
  border-radius: 50px;
  font-weight: 700;
  font-family: "Courier New", monospace;
  color: white;
}

.category-info {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.category-icon {
  width: 30px;
  height: 30px;
  object-fit: contain;
}

.category-name {
  font-weight: 600;
}

.level-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.85rem;
}

.level-badge.facil {
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
}

.level-badge.medio {
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
  color: white;
}

.level-badge.dificil {
  background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
  color: white;
}

.date-cell {
  color: #c6c6c6;
  font-size: 0.9rem;
}

/* Sin registros */
.no-records {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.1) 0%,
    rgba(118, 75, 162, 0.1) 100%
  );
  border-radius: 20px;
  border: 2px solid rgba(102, 126, 234, 0.3);
}

.no-records-icon {
  font-size: 5rem;
  margin-bottom: 1rem;
  animation: pulse 2s ease-in-out infinite;
}

.no-records h3 {
  font-size: 1.8rem;
  font-weight: 700;
  color: white;
  margin: 1rem 0;
}

.no-records p {
  font-size: 1.1rem;
  color: #c6c6c6;
  margin: 0;
}

/* Botones de acción */
.action-buttons {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.action-btn {
  padding: 1.2rem 3rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.back-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
}

.clear-btn {
  background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
  box-shadow: 0 8px 24px rgba(244, 67, 54, 0.4);
}

.action-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
}

.action-btn:active {
  transform: translateY(-1px);
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
  color: white;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.modal-body p {
  font-size: 1.1rem;
  color: #c6c6c6;
  text-align: center;
  margin: 0;
}

.warning-text {
  color: #ff6b6b;
  font-weight: 600;
  font-size: 1rem;
}

.modal-footer {
  display: flex;
  gap: 1rem;
}

.modal-btn {
  flex: 1;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 700;
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.confirm-btn {
  background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
}

.modal-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
}

/* Responsive */
@media (max-width: 1024px) {
  .podium-container {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
  }

  .podium-place.first {
    grid-column: 1;
    grid-row: 1;
  }

  .podium-place.second {
    grid-column: 1;
    grid-row: 2;
  }

  .podium-place.third {
    grid-column: 1;
    grid-row: 3;
  }
}

@media (max-width: 768px) {
  .tiempos-container {
    padding: 1rem;
  }

  .content-wrapper {
    gap: 2rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .filters-section {
    flex-direction: column;
    gap: 1rem;
  }

  .filter-group {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }

  .filter-select {
    width: 100%;
  }

  .table-container {
    overflow-x: scroll;
  }

  .records-table {
    min-width: 800px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
  }

  .modal-content {
    padding: 1.5rem;
  }

  .modal-footer {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 2rem;
  }

  .stat-card {
    padding: 1.5rem;
  }

  .stat-icon {
    font-size: 2.5rem;
  }

  .stat-value {
    font-size: 1.5rem;
  }

  .podium-place {
    padding: 1.5rem 1rem;
  }

  .player-avatar {
    width: 60px;
    height: 60px;
  }

  .player-avatar.champion {
    width: 80px;
    height: 80px;
  }

  .avatar-text {
    font-size: 2rem;
  }

  .player-time {
    font-size: 1.5rem;
  }

  .champion-time {
    font-size: 1.8rem;
  }
}
</style>
