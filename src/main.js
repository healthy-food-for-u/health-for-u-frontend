
import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import axios from 'axios'
import { createPinia } from 'pinia'
import '@/assets/css/bootstrap.min.css'
import '@/assets/css/styles.css'

axios.defaults.withCredentials = true

const app = createApp(App);

const pinia = createPinia();

app.use(router);
app.use(pinia);
app.mount('#app')
