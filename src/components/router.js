import {createRouter, createWebHistory} from 'vue-router'
import mainAuthoriz from "@/components/autoriz/mainAuthoriz.vue";
import TheMain from "@/components/mainPage/TheMain.vue";
import accountInfoEdit from "@/components/mainPage/accountInfoEdit.vue";
import createUser from "@/components/mainPage/createUser.vue";
import deleteUser from "@/components/mainPage/deleteUser.vue";
import store from "@/components/store.js";
import accountInfo from "@/components/account/accountInfo.vue";
import subscribers from "@/components/account/subscribersSubscriptionsPlate.vue";
const Router = createRouter({
    history: createWebHistory(), //to save the history  /
    routes: [
        {path: '/login', component: mainAuthoriz, alias: '/',  meta: { requiresLoading: true }}, //главная страничка где алиас //domen (localhost:5175)/login
        {path: '/mainPage/:category?', name: 'mainPageWithSlug', component: TheMain, meta: { requiresAuth: true, requiresLoading: true }},
        {path:'/editing',component:accountInfoEdit, meta: { requiresAuth: true, requiresLoading: true }},
        {path:'/information',component:accountInfo, meta: { requiresAuth: true, requiresLoading: true },
            children:[
                {path:'subscribers',component:subscribers,meta:{requiresLoading:true}},
                {path:'subscriptions',component:subscribers,meta:{requiresLoading:true}},
            ]
        },
        {path:'/creating',component:createUser},
        {path:'/deleting',component:deleteUser},
    ],
    linkActiveClass: 'active', //классы для активных элементов
    linkExactActiveClass: 'active',

    //плавная прокрутка вверх
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        }
    }
})
//aunthetication
Router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('token'); // Проверка наличия токена

    if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
        next({ path: '/login' }); // Если не аутентифицирован, перенаправляем на страницу входа
    } else {
        next(); // Если аутентифицирован или маршрут не защищен, продолжаем
    }
});

Router.beforeEach(async (to, from, next) => {
    // Проверяем, если маршрут изменился (не только категория, но и сам маршрут)
    const requiresLoading = to.meta.requiresLoading || false; // Флаг для загрузки из метаданных маршрута
    // Проверка, что не изменяется категория на главной странице (смотри ниже)
    const isCategoryChanged = to.params.category !== from.params.category;
    //если только категория поменялась то не нужно все заново перезагружать
    if(isCategoryChanged) {
        store.commit('setLoadingState', { key: 'global', value: false });
    }
    //а если название роута то перезагрузка
    if (requiresLoading && (to.name !== from.name )) {
        // Если изменился маршрут или категория, запускаем загрузку
        store.commit('setLoadingState', { key: 'global', value: true });
        await new Promise(resolve => setTimeout(resolve, 2000)); // имитация задержки
    }
    next();
});

Router.afterEach(() => {
    store.commit('setLoadingState', { key: 'global', value: false });
});

export default Router;

