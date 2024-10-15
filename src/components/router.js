import {createRouter, createWebHistory} from 'vue-router'
import mainAuthoriz from "@/components/autoriz/mainAuthoriz.vue";
import TheMain from "@/components/mainPage/TheMain.vue";
import accountInfoEdit from "@/components/mainPage/accountInfoEdit.vue";
import createUser from "@/components/mainPage/createUser.vue";
import deleteUser from "@/components/mainPage/deleteUser.vue";
const Router = createRouter({
    history: createWebHistory(), //to save the history через /
    routes: [
        {path: '/login', component: mainAuthoriz, alias: '/'}, //главная страничка где алиас //domen (localhost:5175)/login
        {path: '/mainPage',name:'mainPage', component: TheMain, meta: { requiresAuth: true }
            /*children: [
                {path: ':mailId?', component: AppEmailBody, props: true}, //: очень важно //позволяет передать значение mailId как пропс в компонент AppEmailBody. //передаётся в компонент AppEmailBody как пропс благодаря флагу props: true. То есть, если маршрут /mail/1, то mailId = 1.
            ]*/},
        {path:'/editing',component:accountInfoEdit, meta: { requiresAuth: true }},
        {path:'/creating',component:createUser},
        {path:'/deleting',component:deleteUser},
    ],
    linkActiveClass: 'active', //классы для активных элементов
    linkExactActiveClass: 'active',
})

Router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('token'); // Проверка наличия токена

    if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
        next({ path: '/login' }); // Если не аутентифицирован, перенаправляем на страницу входа
    } else {
        next(); // Если аутентифицирован или маршрут не защищен, продолжаем
    }
});

export default Router;

