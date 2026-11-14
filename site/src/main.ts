import { createApp } from 'vue'
import { VanduoVue } from '@vanduo-oss/vd3'
import '@vanduo-oss/vd3/css'
import '../../tokens/tokens.css'
import '../../components/index.css'
import App from './App.vue'
import './style.css'

createApp(App).use(VanduoVue).mount('#app')
