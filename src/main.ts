import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// import serviceAxios from './http/http'

const app = createApp(App)

// app.config.globalProperties.$axios = requestService

app.use(ElementPlus)

app.mount('#app')
