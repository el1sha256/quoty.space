import {createStore} from 'vuex'
//Vuex можно использовать для хранения информации о текущем пользователе и его авторизации.

const store = createStore({
    state: {
        isLoading: {
            global: false, // Глобальное состояние загрузки
            posts: false,  // Загрузка постов
            comments: false, // Загрузка комментариев
            user: false,
            categories: false,
            subscriptions: false,
            /*users: false,  // Загрузка пользователей*/
        },
        isLoggedIn: false, // Состояние авторизации
        user: JSON.parse(localStorage.getItem('user')) || null, // Загружаем данные пользователя из localStorage
        token: localStorage.getItem('token') || null, // Загружаем токен из localStorage
        userName: JSON.parse(localStorage.getItem('userName')) || null,
        description: JSON.parse(localStorage.getItem('description')) || null,
        allPosts: [],
        userPosts: [],
        likedPosts: JSON.parse(localStorage.getItem('likedPosts')) || {}, // Загружаем данные пользователя из localStorage
        savedPosts: JSON.parse(localStorage.getItem('savedPosts')) || {}, // Загружаем данные пользователя из localStorage
        error: {
            small: null,
            normal: null,
            big: null,
        },
        avatar: localStorage.getItem('avatar') || null, // Загружаем аватар из localStorage
        /*usersCache используется для кэширования данных о пользователях при запросах на сервер по ID.
	      users используется для массовой загрузки всех пользователей.*/
        users: [], // Добавляем массив для хранения всех пользователей
        usersCache: {}, // Кэш пользователей
        comments: [],
        openCommentsPostId: null, //котрый щас открыт
        loadingPostId: null, // ID поста, который сейчас загружается

        allCategories: [],
        selectedCategory: null, // Текущая выбранная категория

        userSubscriptionsCache: {}, //место хранения подписок пользователя на которого нажимаем // { userId: { page1: [], page2: [] } }
        userSubscribersCache: {},   // Кеш для подписчиков
    },
    getters: { //нет обязательно геттеры / здесь для количества коммов
        getCommentCount: (state) => (postId) => {
            const post = state.allPosts.find((p) => p.id === postId);
            return post ? post.comments.length : 0;
        },
    },
    mutations: {
        setLoadingState(state, {key, value}) {
            if (key in state.isLoading) {
                state.isLoading[key] = value;
            } else {
                console.warn(`Loading state key "${key}" does not exist.`);
            }
        },

        setLoadingPostId(state, postId) {
            state.loadingPostId = postId;
        },

        setUser(state, user) {
            state.user = user
        },

        setUserCache(state, {userId, user}) { //чтобы
            console.log('Добавление в кэш:', { userId, user });
            state.usersCache = {
                ...state.usersCache, // Сохраняем существующие записи в кэше /Оператор spread (...) копирует все текущие записи в usersCache.
                [userId]: user  // Добавляем или обновляем пользователя по его userId /Если userId уже существует, то запись обновляется. / Если нет, создаётся новая запись.
            };
            console.log('Кэш после обновления:', state.usersCache);
        },

        setUserName(state, userName) {
            state.userName = userName
        },
        setLoggedIn(state, isLoggedIn) {
            state.isLoggedIn = isLoggedIn;
        },
        setAllPosts(state, allPosts) {
            state.allPosts = allPosts
        },
        setUserPosts(state, userPosts) {
            state.userPosts = userPosts
        },
        setToken(state, token) {
            state.token = token
        },
        clearUser(state) {
            state.user = null
            state.token = null
            state.allPosts = []
            state.userPosts = []
            state.isLoggedIn = false
            state.userName = null
            state.description = null
            state.likedPosts = {}
        },
        updateUser(state, user) { // Новая мутация для обновления пользователя
            state.user = {...state.user, ...user}; // Обновляем информацию о пользователе
        },

        setError(state, {type, message}) {
            if (type in state.error) {
                state.error[type] = message;
                console.log(`Ошибка установлена для типа "${type}":`, message);
            } else {
                console.error(`Error type "${type}" is not defined in state.error`);
            }
        },
        clearError(state, type) {
            if (type in state.error) {
                state.error[type] = null;
            } else {
                console.error(`Error type "${type}" is not deleted`);
            }
        },
        setDescription(state, description) {
            state.description = description;
        },
        setAvatar(state, avatar) {
            state.avatar = avatar;
        },
        setUsers(state, users) {
            state.users = users;
        },
        setLikedPosts(state, likedPosts) {
            state.likedPosts = likedPosts;
            localStorage.setItem('likedPosts', JSON.stringify(state.likedPosts));
        },
        setSavedPosts(state, savedPosts) {
            state.savedPosts = savedPosts;
            localStorage.setItem('savedPosts', JSON.stringify(state.savedPosts));
        },

        incrementLikes(state, {userId, postId}) {
            const post = state.allPosts.find(p => p.id === postId);
            if (post) {
                post.likes += 1; // Увеличиваем общее количество лайков
                console.log('incrementLikes', state.allPosts);
                // Проверяем, есть ли уже лайк у пользователя
                if (!state.likedPosts[userId]) {
                    state.likedPosts[userId] = []; // Инициализируем массив лайков для пользователя, если его нет
                }
                // Добавляем пост в массив лайков пользователя, если его там нет
                if (!state.likedPosts[userId].includes(postId)) {
                    state.likedPosts[userId].push(postId);
                }
                localStorage.setItem('likedPosts', JSON.stringify(state.likedPosts)); // Обновляем localStorage
            }
        },
        decrementLikes(state, {userId, postId}) {
            console.log('likedPosts до удаления:', JSON.stringify(state.likedPosts, null, 2));
            const post = state.allPosts.find(p => p.id === postId);
            if (post && post.likes > 0) {
                post.likes -= 1; // Уменьшаем общее количество лайков
                console.log('decrementLikes', state.allPosts);
                // Удаляем пост из массива лайков пользователя
                if (state.likedPosts[userId]) {
                    state.likedPosts[userId] = state.likedPosts[userId].filter(id => id !== postId);
                    console.log('Проверка likedPosts после удаления:', state.likedPosts[userId]);
                }
                // Если после удаления массив пуст, удаляем ключ для userId из likedPosts
                if (state.likedPosts[userId] && state.likedPosts[userId].length === 0) {
                    delete state.likedPosts[userId];
                    console.log(`Удален ключ ${userId} из likedPosts:`, state.likedPosts);
                }
            }
            // Обновляем localStorage после изменения likedPosts
            localStorage.setItem('likedPosts', JSON.stringify(state.likedPosts));
        },
        incrementSavedPosts(state, {userId, postId}) {
            const post = state.allPosts.find(p => p.id === postId);
            if (post) {
                post.savings += 1;
                if (!state.savedPosts[userId]) {
                    state.savedPosts[userId] = [];
                }
                if (!state.savedPosts[userId].includes(postId)) {
                    state.savedPosts[userId].push(postId);
                }
                localStorage.setItem('savedPosts', JSON.stringify(state.savedPosts));
            }
        },
        decrementSavedPosts(state, {userId, postId}) {
            const post = state.allPosts.find(p => p.id === postId);
            if (post && post.savings > 0) {
                post.savings -= 1;
                if (state.savedPosts[userId]) {
                    state.savedPosts[userId] = state.savedPosts[userId].filter(id => id !== postId);
                }
                if (state.savedPosts[userId] && state.savedPosts[userId].length === 0) {
                    delete state.savedPosts[userId];
                }
            }
            localStorage.setItem('savedPosts', JSON.stringify(state.savedPosts));
        },

        addComment(state, {postId, comment}) {
            const post = state.allPosts.find(p => p.id === postId);
            if (post) {
                post.comments.push(comment);
                console.log('mutations  addComment', comment) //okay
            } else {
                console.error(`Пост с ID ${postId} не найден`);
            }
        },
        deleteComment(state, {postId, commentId}) {
            const post = state.allPosts.find(p => p.id === postId);
            console.log('mutations  deleteComment', commentId)
            if (post && post.comments.length > 0) {
                post.comments = post.comments.filter(comment => comment.id !== commentId);
            }
        },
        setComments(state, {postId, comments}) {
            const post = state.allPosts.find(p => p.id === postId);
            if (post) { //Данные сохраняются в state.allPosts, в объекте конкретного поста.
                post.comments = comments;
            } else {
                console.error(`Пост с ID ${postId} не найден для добавления комментариев`);
            }
        },
        setOpenCommentsPostId(state, postId) {
            state.openCommentsPostId = postId;
        },

        setCategories(state, categories) {
            state.allCategories = categories;
        },

        setSelectedCategory(state, category) {
            state.selectedCategory = category;
        },
        addPost(state, post) {
            state.allPosts.push(post);
        },

        //cache for subscriptions
        setSubscriptionsCache(state, { userId, page, data }) {
            console.log('Добавление подписок в кэш:', { userId, data });
            if (!state.userSubscriptionsCache[userId]) {
                state.userSubscriptionsCache[userId] = {};
            }
            state.userSubscriptionsCache[userId][page] = data;
            console.log('Кэш подписок после обновления:', state.userSubscriptionsCache);

        },
        //cache for subscribers
        setSubscribersCache(state, { userId, page, data }) {
            console.log('Добавление подписок в кэш:', { userId, data });
            if (!state.userSubscribersCache[userId]) {
                state.userSubscribersCache[userId] = {};
            }
            state.userSubscribersCache[userId][page] = data;
            console.log('Кэш подписчиков после обновления:', state.userSubscribersCache);
        },


        loadSubscribers(state, subscribers) { //idk wth
            state.userSubscribers = subscribers;
        },
    },
    actions: {
        async login({commit, dispatch}, credentials) {

            commit('setLoadingState', {key: 'global', value: true}); //загрузка
            try {
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
                    // Вызов действия для загрузки постов после логина
                    await dispatch('fetchUserPosts', data.user.id);
                    await dispatch('fetchAllPosts', data.user.id);
                    await dispatch('fetchUsers'); // Добавляем загрузку всех пользователей
                    // Вызов restoreUser для обновления данных пользователя в Vuex
                    await dispatch('restoreUser');

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
                    throw new Error('Такого пользователя не существует');
                }
            } catch (error) {

                dispatch('handleError', {
                    type: 'normal',
                    message: {
                        heading: 'Ошибка авторизации',
                        text: error.message,
                    },
                });
                console.log(error);
            } finally {
                commit('setLoadingState', {key: 'global', value: false}); //загрузка
            }

        },
        logout({commit}, router) {
            commit('clearUser');
            commit('clearAllPosts');
            commit('clearUserPosts');
            commit('setLoggedIn', false);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            router.push('/login');
        },

        async restoreUser({commit, dispatch}) {
            commit('setLoadingState', {key: 'user', value: true}); //загрузка
            try {
                const token = localStorage.getItem('token');
                const userData = JSON.parse(localStorage.getItem('user'));
                await new Promise((resolve) => setTimeout(resolve, 2000)); // Задержка 2 секунды
                if (token) {
                    commit('setToken', token);
                    if (userData) {
                        commit('setUser', userData);
                        commit('setUserName', userData.userName);
                        commit('setDescription', userData.description);
                        commit('setAvatar', userData.avatar);
                        commit('setLoggedIn', true);
                    } else {

                    }
                } else {

                    commit('setLoggedIn', false);
                }
            } catch (error) {
                dispatch('handleError', error);
            } finally {

                commit('setLoadingState', {key: 'user', value: false});
            }
        },
        async UpdateUser({commit, dispatch}, userData) { // Новое действие для обновления пользователя

            try {
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
            } catch (error) {
                dispatch('handleError', error);
            } finally {

            }
        },
        async RegisterUser({commit, dispatch}, userData) {

            try {
                const response = await fetch('http://localhost:3000/api/user/register', {
                    method: 'POST',
                    headers: {'Content-type': 'application/json'},
                    body: JSON.stringify(userData),
                });
                if (response.ok) {
                    const data = await response.json();
                    commit('setToken', data.token);
                    commit('setUser', data.user);
                    commit('setUserName', data.userName);
                    commit('setDescription', data.description);
                    /* commit('setAvatar', data.avatar);*/
                    localStorage.setItem('user', JSON.stringify(data.user));
                    localStorage.setItem('token', data.token);

                    if (userData.avatar) {
                        await this.RegisterAvatar({commit}, {avatar: userData.avatar, userId: data.user.id});

                        console.log('DSZDALIS ZAGRUZKI:RegisterUser');
                    }
                    return data.user;

                    // Проверяем, появился ли новый пользователь в базе данных
                    const checkUserResponse = await fetch(`http://localhost:3000/api/user/${data.user.id}`);
                    if (checkUserResponse.ok) {
                        const userCheckData = await checkUserResponse.json();
                        console.log('Пользователь зарегистрирован и проверен:', userCheckData);
                    } else {
                        console.error('Ошибка при проверке пользователя в базе данных');
                    }


                } else {

                    throw new Error('К сожалению не удалось зарегистрироваться, так как пользователь уже существует.');
                }
            } catch (error) {

                dispatch('handleError', {
                    type: 'normal',
                    message: {
                        heading: 'Ошибка при регистрации',
                        text: error.message,
                    },
                });

            } finally {

            }
        },

        async RegisterAvatar({commit}, {avatar, userId}) {
            const formData = new FormData();

            formData.append('avatar', avatar);
            console.log('Форма данных:', formData);
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
                commit('setAvatar', data.avatar);
                console.log('Аватар успешно загружен:', data.avatar);
                return data;
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ошибка при загрузке аватара');
            }
        },

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
        handleError({commit}, {type, message}) {
            const defaultMessage = {
                heading: 'Ошибка',
                text: 'Произошла ошибка', // Текст по умолчанию
            };
            const errMessage = message || defaultMessage;
            commit('setError', {type, message: errMessage});

        },
        clearError({commit}, type) {
            commit('clearError', type); // Очищаем сообщение об ошибке
        },

        async fetchUserPosts({commit, state, dispatch}, userId) {

            try {
                const response = await fetch(`http://localhost:3000/api/user/${userId}/posts`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${state.token}`, // передаем токен
                        'Content-Type': 'application/json'
                    }
                });
                if (response.ok) {
                    const posts = await response.json();
                    commit('setUserPosts', posts);


                } else {
                    throw new Error('Unable to fetch posts');
                }
            } catch (error) {
                console.error('Ошибка при загрузке постов:', error.message);
                dispatch('handleError', error);
            } finally {

            }
        },


        async fetchAllPosts({commit, dispatch, state}) {
            commit('setLoadingState', {key: 'posts', value: true});
            try {
                let url = 'http://localhost:3000/api/posts';
                console.log('first url', url)
                if (state.selectedCategory) {
                    url = `${url}?category=${state.selectedCategory}`;
                    console.log('2nd url', url)
                }
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error('Ошибка при получении постов: ' + response.statusText);
                }
                await new Promise((resolve) => setTimeout(resolve, 2000)); // Задержка 2 секунды
                const posts = await response.json(); // Предполагаем, что сервер возвращает данные с именем `posts`
                commit('setAllPosts', posts); // Коммитим посты в Vuex
                console.log('posts', posts)
            } catch (error) {
                console.error('Ошибка при получении постов:', error.message);

                dispatch('handleError', {
                    type: 'small',
                    message: {
                        heading: 'Ошибка при запросе постов нахуй',
                        text: error.message,
                    },
                });

            } finally {
                commit('setLoadingState', {key: 'posts', value: false});
            }
        },


        async likePost({commit, state}, {userId, postId}) {
            // Отправляем запрос на сервер для обновления количества лайков
            try {
                const response = await fetch(`http://localhost:3000/api/posts/${postId}/like`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({userId}) // Передаем userId в теле запроса
                });
                if (response.ok) {
                    commit('incrementLikes', {userId, postId}); // обновляем состояние
                    console.log('Лайкнутые посты:', state.likedPosts);
                } else {
                    console.error("Не удалось лайкнуть пост на сервере");
                }

                //отладка
                const data = await response.json();
                console.log("Ответ сервера после dobavlenia лайка:", data); // Вывод ответа в консоль клиента
                const currentPosts = JSON.parse(data.debugInfo.currentPosts);
                console.log("Текущие посты (после удаления лайка):", currentPosts);
                console.log("Отладочная информация:", data.debugInfo.request);
                const postsafterlike = data.debugInfo.postsafterlike;
                console.log("Текущие postsafterlike (do удаления лайка):", postsafterlike);
                const likedpostsafterlike = data.debugInfo.likedpostsafterlike;
                console.log("Текущие likedpostsafterlike (do удаления лайка):", likedpostsafterlike);

            } catch (error) {
                console.error("Ошибка при лайке поста:", error);
            }
        },


        async unlikePost({commit, state}, {userId, postId}) {
            try {
                // Отправляем запрос на сервер для обновления количества лайков
                const response = await fetch(`http://localhost:3000/api/posts/${postId}/unlike`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({userId}) // Передаем userId в теле запроса
                });

                if (response.ok) {
                    commit('decrementLikes', {userId, postId});
                    console.log('Лайкнутые посты после удаления:', state.likedPosts);
                    console.log('Лайкi unlikePost после удаления:', state.allPosts);

                } else {
                    console.error("Не удалось снять лайк с поста на сервере");
                }

                //отладка
                const data = await response.json();
                console.log("Ответ сервера после удаления лайка2:", data); // Вывод ответа в консоль клиента
                const currentPosts = data.debugInfo.currentPosts;
                console.log("Текущие посты (после удаления лайка):", currentPosts);
                const currentIndex = data.debugInfo.index;
                console.log("Текущие index (после удаления лайка):", currentIndex);

            } catch (error) {
                console.error("Ошибка при снятии лайка с поста:", error);
            }
        },

        async savePost({commit, state}, {postId, userId}) {
            try {
                const response = await fetch(`http://localhost:3000/api/posts/${postId}/save`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({userId}) // Передаем postId в теле запроса
                });
                if (response.ok) {
                    commit('incrementSavedPosts', {userId, postId})
                } else {
                    console.error("Не удалось сохранить пост на сервере");
                }
            } catch (error) {
                console.error('Ошибка при сохранении поста:', error);
            }
        },
        async unsavePost({commit}, {postId, userId}) {
            try {
                const response = await fetch(`http://localhost:3000/api/posts/${postId}/unsave`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': "application/json",
                    },
                    body: JSON.stringify({userId})
                });
                if (response.ok) {
                    commit('decrementSavedPosts', {userId, postId})
                } else {
                    console.error("Не удалось delete пост");
                }
            } catch (error) {
                console.error('Ошибка при deletion of поста:', error);
            }
        },

        async addComment({commit, dispatch}, {postId, userId, content}) {
            try {
                const response = await fetch(`http://localhost:3000/api/posts/${postId}/comments`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({userId, content})
                });
                if (response.ok) {
                    const comment = await response.json();
                    const user = await dispatch('fetchUser', userId);
                    console.log('Данные пользователя для комментария:', user); // okay
                    const commentWithUserInfo = {
                        ...comment,
                        user: {
                            avatar: user.avatar,
                            description: user.description,
                            username: user.userName,
                        }
                    };

                    commit('addComment', {postId, comment: commentWithUserInfo});
                    console.log('async addComment:', commentWithUserInfo);
                }
            } catch (error) {
                dispatch('handleError', error);
                console.error('Ошибка при добавлении комментария:', error)
            } finally {

            }
        },


        async deleteComment({commit, dispatch}, {postId, commentId}) {
            try {

                const response = await fetch(`http://localhost:3000/api/posts/${postId}/comments/${commentId}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    commit('deleteComment', {postId, commentId});
                } else {
                    console.error("Не удалось удалить комментарий");
                }
            } catch (error) {
                dispatch('handleError', error);
                console.error('Ошибка при удалении комментария:', error);
            } finally {
            }
        },
        //через айди пользователя восстанавливаем инфу о пользователе
        async loadComments({commit, dispatch}, postId) {

            commit('setLoadingState', {key: 'comments', value: true});
            try {
                console.log('loadComments 1st', postId) //okay
                const response = await fetch(`http://localhost:3000/api/posts/${postId}/comments`, { //по каждому посту и массиву комментс
                    method: 'GET',
                });
                if (response.ok) {
                    const {comments} = await response.json();
                    // Загружаем информацию о каждом пользователе
                    console.log('loadComments comments', comments); //okay
                    //заменяются имена людей которые уже написали комментарии на текущего чела
                    const commentsWithUserInfo = await Promise.all(comments.map(async (comment) => {  //проходит по каждому объекту комментария в comments.
                        // Получаем пользователя из Vuex
                        const user = await dispatch('fetchUser', comment.userId);
                        console.log('loadComments commentsWithUserInfo Айдишник', comment.userId);
                        console.log('loadComments commentsWithUserInfo Юзер', user); //description имеем /bb
                        return {
                            ...comment,
                            user: {
                                avatar: user.avatar,
                                description: user.description,
                                username: user.userName,
                            },
                        };
                    }));
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                    commit('setComments', {postId, comments: commentsWithUserInfo});
                    console.log('loadComments SetComments юзер', commentsWithUserInfo);
                    return commentsWithUserInfo;
                } else {
                    console.error("Не удалось загрузить комментарии");
                }
            } catch (error) {
                dispatch('handleError', error);
                console.error("Ошибка при загрузке комментариев:", error);
            } finally {
                /* commit('setLoading', false);*/
                commit('setLoadingState', {key: 'comments', value: false});
            }
        },


        //включает в себя айди юзернейн гмайл имя субскрипшнс и субскрайберс (именно айдишники их)
        async fetchUser({commit, state,dispatch}, userId) {
            commit('setLoadingState', {key: 'comments', value: true});
            // Проверяем, есть ли пользователь в кэше
            console.log('fetchUser1', userId) //два раза и два разных

            if (state.usersCache[userId]) {
                console.log('fetchUser2', state.usersCache[userId]) //working
                return state.usersCache[userId]; // Если данные есть в кэше, возвращаем их
            }
            try {
                console.log('Отправка запроса на сервер с userId:', userId);
                const response = await fetch(`http://localhost:3000/api/users/${userId}`);
                console.log('Получен ответ от сервера с кодом:', response.status); // Отслеживаем статус ответа
                if (response.ok) {
                    const user = await response.json();
                    console.log('async fetchUser3', user)
                    commit('setUserCache', {userId, user}); // Сохраняем пользователя в кэш, не затрагивая текущего пользователя
                    return user;
                } else {
                    console.error('Пользователь не найден');
                }
            } catch (error) {
                dispatch('handleError', error);
                console.error('Ошибка при загрузке данных пользователя:', error);
            }finally{
                commit('setLoadingState', {key: 'comments', value: false});
            }
        },

        async fetchUsers({commit, dispatch}) { //загрузить всех пользоватлей для корректного отображения постов
            try {
                const response = await fetch('http://localhost:3000/api/users', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`, // передаем токен
                        'Content-Type': 'application/json'
                    }
                });
                if (response.ok) {
                    const users = await response.json();
                    commit('setUsers', users); // Сохраняем пользователей в состоянии Vuex

                } else {
                    throw new Error('Unable to fetch users');
                }
            } catch (error) {
                console.error('Ошибка при загрузке пользователей:', error.message);
            }
        },

        async fetchCategories({commit}, dispatch) { //загрузить категории с сервера
            try {
                const response = await fetch('http://localhost:3000/api/categories', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (response.ok) {
                    const categories = await response.json();
                    commit('setCategories', categories);
                } else {
                    throw new Error('Unable to fetch categories');
                }
            } catch (error) {
                dispatch('handleError', error);
            }
        },


        async addPost({commit, dispatch}, {userId, postContent}) {
            try {
                const response = await fetch(`http://localhost:3000/api/posts`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({userId, postContent})
                });
                if (!response.ok) {
                    throw new Error("Failed to add post");
                }
                const addedPost = await response.json();
                commit("addPost", addedPost);
                console.log('addPost', addedPost)

            } catch (error) {
                dispatch('handleError', {
                    type: 'normal',
                    message: {
                        heading: 'Ошибка добавления поста',
                        text: error.message,
                    },
                });

            }
        },
        async deletePost({commit, dispatch}, {userId, postId}) {
            try {
                const response = await fetch(`http://localhost:3000/api/posts/${postId}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    commit('deleteComment', {postId});
                } else {
                    console.error("Не удалось удалить комментарий");
                    throw new Error('Пост не был найден')
                }
            }catch (error) {
                dispatch('handleError', {
                    type: 'normal',
                    message: {
                        heading: 'Ошибка при удалении поста',
                        text: error.message,
                    },
                });
            }
        },


        //универсальный метод /получаем тип в вызове метода / и тогда решаем загружать подписки или подписчики
        async fetchSubscriptionsSubscribers({commit, dispatch, state}, {userId, type, page, limit}) {

            console.log('fetchSubscriptionsSubcscribers1', userId, type, page, limit)
            // Проверяем кеш для данного типа
            const cacheKey = type === 'subscriptions' ? 'userSubscriptionsCache' : 'userSubscribersCache';
            if (state[cacheKey][userId] && state[cacheKey][userId][page]) {
                console.log(`${type} найдены в кеше для страницы ${page}:`, state[cacheKey][userId][page]);
                return { items: state[cacheKey][userId][page], hasNextPage: true }; // Возвращаем данные из кеша
            }
            try {
                const response = await fetch(`http://localhost:3000/api/users/${userId}/${type}?page=${page}&limit=${limit}`);
                const data = await response.json();
                console.log('API Response:', data); //okay
                if(response.ok) {
                    const mutation = type === 'subscriptions' ? 'setSubscriptionsCache' : 'setSubscribersCache';
                    commit(mutation, { userId, page, data: data[type] }); // Сохраняем данные по странице
                    return { items: data[type], total: data.total, hasNextPage: data.hasNextPage };

                }else{
                    throw new Error('Unable to fetch subscriptions');
                }

            } catch (error) {
                dispatch('handleError', {
                    type: 'small',
                    message: {
                        heading: 'Ошибка при запросе постов нахуй',
                        text: error.message,
                    },
                });
            }finally{
            }
        },
    }
});
export default store;


