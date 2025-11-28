import { createRouter, createWebHistory } from "vue-router";
import Inicio from "../components/inicio.vue";
import Caracteristicas from "../components/caracteristicas.vue";
import Juego from "../components/juego.vue";
import Niveles from "../components/niveles.vue";
import Tiempos from "../components/tiempos.vue";

const routes = [
  {
    path: "/",
    name: "Inicio",
    component: Inicio,
  },
  {
    path: "/caracteristicas",
    name: "Caracteristicas",
    component: Caracteristicas,
  },
  {
    path: "/juego",
    name: "Juego",
    component: Juego,
  },
  {
    path: "/niveles",
    name: "Niveles",
    component: Niveles,
  },
  {
    path: "/tiempos",
    name: "Tiempos",
    component: Tiempos,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
