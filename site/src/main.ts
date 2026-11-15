import { createApp } from 'vue'
import { VanduoVue, setThemeDefaults } from '@vanduo-oss/vd3'
import '@vanduo-oss/vd3/css'
import '../../tokens/tokens.css'
import '../../components/index.css'
import App from './App.vue'
import './style.css'

// Site-wide defaults: cyan primary in both schemes, so the customizer's
// "Reset to default" restores cyan (not the library's amber baseline).
setThemeDefaults({ PRIMARY_LIGHT: 'cyan', PRIMARY_DARK: 'cyan' })

createApp(App).use(VanduoVue).mount('#app')
