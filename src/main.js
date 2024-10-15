import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './components/router.js'
import store from './components/store.js'


const app = createApp(App);
/*app.use(store);*/
app
    .use(router) //как плагин используем
    .use(store)
    .mount('#app');

/*store.dispatch('fetchUsers');  // Загружаем пользователей при запуске*/

/*createApp(App).mount('#app')*/
