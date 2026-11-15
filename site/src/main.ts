import { createApp } from 'vue'
import { VanduoVue, setThemeDefaults } from '@vanduo-oss/vd3'
import '@vanduo-oss/vd3/css'
import '../../tokens/tokens.css'
import '../../components/index.css'
import App from './App.vue'
import './style.css'

// Site-wide defaults: cyan primary in both schemes and Open Sans as the global
// typeface, so first visit and the customizer's "Reset to default" both land
// here (not the library's amber/ubuntu baseline).
setThemeDefaults({ PRIMARY_LIGHT: 'cyan', PRIMARY_DARK: 'cyan', FONT: 'open-sans' })

createApp(App).use(VanduoVue).mount('#app')
