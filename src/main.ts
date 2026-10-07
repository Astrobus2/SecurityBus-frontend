import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import { useConductor } from '@/conductor/presentation/state/useConductor'
import './assets/global.css'

// Recupera la sesión y el turno en curso guardados en localStorage.
useConductor().restaurar()

createApp(App).use(router).mount('#app')
