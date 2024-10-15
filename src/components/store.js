import {createStore} from 'vuex'
//Vuex можно использовать для хранения информации о текущем пользователе и его авторизации.

const store = createStore({
    state: {
        isLoggedIn: false, // Состояние авторизации
        user: JSON.parse(localStorage.getItem('user')) || null, // Загружаем данные пользователя из localStorage
        token: localStorage.getItem('token') || null, // Загружаем токен из localStorage
        posts: [],
    },
    mutations: {
        setUser(state, user) {
            state.user = user
        },
        setLoggedIn(state, isLoggedIn) {
            state.isLoggedIn = isLoggedIn;
        },
        setPosts(state, posts) {
            state.posts = posts
        },
        setToken(state, token) {
            state.token = token
        },
        clearUser(state) {
            state.user = null
            state.token = null
            state.posts = []
        },
        updateUser(state, user) { // Новая мутация для обновления пользователя
            state.user = {...state.user, ...user}; // Обновляем информацию о пользователе
        },
    },
    actions: {
        async login({commit}, credentials) {
            const response = await fetch('http://localhost:3000/login', { //обращается к логину
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(credentials), //передаются только email и password в credentials.
            });
            if (response.ok) {
                const data = await response.json();
                commit('setToken', data.token);
                commit('setUser', data.user);
                commit('setLoggedIn', true);
                /*commit('setPosts',data.posts);*/
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                /* localStorage.setItem('posts',data.posts);*/
                /*this.$router.push('/mainPage'); // Убедитесь, что этот код выполняется*/

                /*// Устанавливаем таймер для выхода по истечении срока действия токена
                const tokenPayload = JSON.parse(atob(data.token.split('.')[1]));
                const expirationTime = tokenPayload.exp * 1000; // переводим в миллисекунды
                const currentTime = Date.now();

                // Вычисляем время до истечения токена
                const timeUntilExpiration = expirationTime - currentTime;

                // Устанавливаем таймер выхода
                setTimeout(() => {
                    this.logout({}); // Выходим из аккаунта
                }, timeUntilExpiration);*/
            } else {
                throw new Error('Unable to login');
            }
        },
        logout({commit}, router) { //В Vuex нет доступа к экземпляру приложения и, следовательно, к this.$router.
            commit('clearUser');
            commit('clearPosts');
            commit('setLoggedIn', false);
            localStorage.removeItem('token');
            localStorage.removeItem('user'); // Удаление данных пользователя из localStorage
            router.push('/login'); // Перенаправление на страницу входа
        },

        restoreUser({commit}) {
            const token = localStorage.getItem('token');
            if (token) {
                // Здесь вы можете добавить логику для восстановления информации о пользователе
                commit('setToken', token);
                /*commit('setUser', data.user);*/
                // Если у вас есть метод для получения пользователя по токену, вызовите его
                // например: fetchUserData(token).then(user => commit('setUser', user));
            }
        },
        async UpdateUser({commit}, userData) { // Новое действие для обновления пользователя
            const response = await fetch('http://localhost:3000/api/user/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${localStorage.getItem('token')}` // Отправляем токен для аутентификации
                },
                body: JSON.stringify(userData), // Отправляем новые данные пользователя
            });
            if (response.ok) {
                const updatedUser = await response.json();
                commit('updateUser', updatedUser.user); // Обновляем состояние Vuex
                localStorage.setItem('user', JSON.stringify(updatedUser.user)); // Обновляем данные в localStorage
            } else {
                throw new Error('Unable to update user');
            }

        },
        async RegisterUser({commit}, userData) {
            const response = await fetch('http://localhost:3000/api/user/register', { //обращается к регистратору
                method: 'POST',
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify(userData), //передаются данные нового пользователя в userData (обычно это как минимум email и password, но могут быть и другие поля, например, name, phone и т.д.).
            });
            if (response.ok) {
                const data = await response.json();
                commit('setToken', data.token);
                commit('setUser', data.user);
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('token', data.token);

                // Проверяем, появился ли новый пользователь в базе данных
                const checkUserResponse = await fetch(`http://localhost:3000/api/user/${data.user.id}`);
                if (checkUserResponse.ok) {
                    const userCheckData = await checkUserResponse.json();
                    console.log('Пользователь зарегистрирован и проверен:', userCheckData);
                } else {
                    console.error('Ошибка при проверке пользователя в базе данных');
                }

                return data.user;
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ошибка при регистрации');
            }
        },
        async DeleteUser({commit}, userData) {
            const response = await fetch('http://localhost:3000/api/user/delete', {
                method: 'DELETE',
                headers:{
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body:JSON.stringify(userData),
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data.message);
                return data.message;
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ошибка при удалении пользователя');
            }
        }
    }
});
export default store;


