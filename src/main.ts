/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

import '@vue-flow/minimap/dist/style.css'
import '@vue-flow/controls/dist/style.css'
// Components
import App from './App.vue'

import './assets/main.css'
// Composables
import { createApp } from 'vue'

const app = createApp(App)

registerPlugins(app)

app.mount('#app')
