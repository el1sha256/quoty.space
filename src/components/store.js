import {createStore} from 'vuex'
//Vuex можно использовать для хранения информации о текущем пользователе и его авторизации.

const store = createStore({
    state: {
        isLoggedIn: false, // Состояние авторизации
        user: JSON.parse(localStorage.getItem('user')) || null, // Загружаем данные пользователя из localStorage
        token: localStorage.getItem('token') || null, // Загружаем токен из localStorage
        userName: JSON.parse(localStorage.getItem('userName')) || null,
        description: JSON.parse(localStorage.getItem('description')) || null,
        posts: [],
        error: null,
        avatar: localStorage.getItem('avatar') || null, // Загружаем аватар из localStorage
        /*avatar: null,*/
    },
    mutations: {
        setUser(state, user) {
            state.user = user
        },
        setUserName(state, userName) {
            state.userName = userName
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
            state.isLoggedIn = false
            state.userName= null
            state.description = null
        },
        updateUser(state, user) { // Новая мутация для обновления пользователя
            state.user = {...state.user, ...user}; // Обновляем информацию о пользователе
        },
        setError(state, errMessage) {
            state.error = errMessage;
        },
        clearError(state) {
            state.error = null;
        },
        setDescription(state, description) {
            state.description = description;
        },
        setAvatar(state, avatar) {
            state.avatar = avatar;
        }
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
                commit('setUserName', data.user.userName);
                commit('setDescription', data.user.description);
                commit('setAvatar', data.user.avatar);
                /*commit('setPosts',data.posts);*/
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

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
            commit('clearUser'); //очищает и никнейм и описание
            commit('clearPosts');
            /*commit('clearUserName');
            commit('clearDescription');*/
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
                commit('setUserName', data.userName);
                commit('setDescription', data.description);
                commit('setAvatar', data.avatar);
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('token', data.token);

                if (userData.avatar) {
                    await this.RegisterAvatar({ commit }, { avatar: userData.avatar, userId: data.user.id });
                }

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

        async RegisterAvatar({commit}, { avatar, userId }) {
            const formData = new FormData();
            formData.append('avatar', avatar); // Добавляем аватар в FormData
            const token = localStorage.getItem('token'); // Получаем токен из localStorage
            const response = await fetch(`http://localhost:3000/api/user/upload-avatar/${userId}`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}` // Передаем токен в заголовке
                },
            });
            if (response.ok) {
                const data = await response.json();
                commit('setAvatar', data.avatar); // Сохраняем новый аватар в Vuex
                console.log('Аватар успешно загружен:', data.avatar);
                return data;
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ошибка при загрузке аватара');
            }
        },




        /*async RegisterAvatar({commit}, avatarData) {
            const formData = new FormData();
            formData.append('avatar', avatarData.avatar); // Добавляем аватар в FormData

            const response = await fetch('http://localhost:3000/api/user/upload-avatar', {
                method: 'POST',
                body: formData, // Отправляем только FormData с аватаром
               /!* headers: {'Content-Type': 'multipart/form-data'},*!/
            });
            if (response.ok) {
                const data = await response.json();
                commit('setAvatar', data.avatar); // Сохраняем новый аватар в Vuex
                console.log('Аватар успешно загружен:', data.avatar);
                return data;
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ошибка при загрузке аватара');
            }
        },*/

        async DeleteUser({commit}, userData) {
            const response = await fetch('http://localhost:3000/api/user/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(userData),
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data.message);
                return data.message;
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ошибка при удалении пользователя');
            }
        },
        handleError({commit}, error) {
            const errMessage = error.message || 'Произошла ошибка'; // Динамическое сообщение об ошибке
            commit('setError', errMessage);
            // Вы также можете выполнять дополнительные действия, например, отправить ошибку на сервер
        },
        clearError({commit}) {
            commit('clearErrorMessage'); // Очищаем сообщение об ошибке
        },
    }
});
export default store;


