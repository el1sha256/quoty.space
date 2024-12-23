import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './components/router.js'
import store from './components/store.js'


import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

import AOS from 'aos';
import 'aos/dist/aos.css';

import gsap from "gsap"; //анимация для всего

const notyf = new Notyf({ //анимация уведомлений
    position: { x: 'center', y: 'center' },
    dismissible: true,
    ripple: false,
    icon: {
        className: 'custom-success-icon',
        tagName: 'i',
    },
    types: [
        {
            type: 'success',
            background: 'white',
            icon: false,
        },
    ],
});

AOS.init({ //анимация прокрутки
    duration: 1000, // Длительность анимации (мс)
    offset: 120,    // Расстояние от нижнего края экрана до элемента
    once: true,     // Анимация только один раз
});

const app = createApp(App);

app
    .use(router) //как плагин используем
    .use(store)
    .mount('#app');


app.config.globalProperties.$notyf = notyf;  // Добавляем в глобальные свойства
app.config.globalProperties.$gsap = gsap;

