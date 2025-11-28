# Sistema de Rutas - Juego del Ahorcado

Este directorio contiene la configuración de rutas de Vue Router para la aplicación.

## Rutas Disponibles

### 1. **Inicio** (`/`)

- **Componente**: `inicio.vue`
- **Descripción**: Página principal del juego con bienvenida
- **Funcionalidad**: Botón para navegar a características

### 2. **Características** (`/caracteristicas`)

- **Componente**: `caracteristicas.vue`
- **Descripción**: Muestra las características del juego
- **Funcionalidad**: 6 tarjetas con características y botón para volver al inicio

### 3. **Juego** (`/juego`)

- **Componente**: `juego.vue`
- **Descripción**: Pantalla principal del juego del ahorcado
- **Estado**: Pendiente de implementación

### 4. **Niveles** (`/niveles`)

- **Componente**: `niveles.vue`
- **Descripción**: Selección de niveles de dificultad
- **Estado**: Pendiente de implementación

### 5. **Tiempos** (`/tiempos`)

- **Componente**: `tiempos.vue`
- **Descripción**: Configuración de tiempos y récords
- **Estado**: Pendiente de implementación

## Cómo Agregar Nuevas Rutas

Para agregar una nueva ruta al proyecto:

1. Crea el componente en `src/components/`
2. Importa el componente en `src/router/index.js`
3. Agrega la configuración de la ruta en el array `routes`:

```javascript
{
  path: '/nueva-ruta',
  name: 'NombreRuta',
  component: NuevoComponente
}
```

## Navegación Programática

Para navegar entre rutas desde un componente:

```javascript
import { useRouter } from "vue-router";

const router = useRouter();

// Navegar a una ruta
router.push("/caracteristicas");

// Navegar con nombre
router.push({ name: "Caracteristicas" });

// Volver atrás
router.back();
```

## Navegación con Router-Link

Para crear enlaces en el template:

```vue
<router-link to="/caracteristicas">Ir a Características</router-link>
```

## Estructura del Proyecto

```
src/
├── router/
│   ├── index.js          # Configuración principal de rutas
│   └── README.md         # Este archivo
├── components/
│   ├── inicio.vue        # Página de inicio
│   ├── caracteristicas.vue
│   ├── juego.vue
│   ├── niveles.vue
│   └── tiempos.vue
└── App.vue               # Componente raíz con <router-view>
```

## Notas Importantes

- Todas las rutas usan `createWebHistory()` para URLs limpias sin `#`
- El componente `<router-view />` en `App.vue` renderiza el componente de la ruta actual
- Las rutas están configuradas para ser fácilmente escalables
