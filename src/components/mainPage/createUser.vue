<script>
import {mapActions, mapState} from "vuex";
import { useToast } from 'vue-toastification';
import {commonMethods} from '../mixins/commonMethods';
import Main_error from "@/components/errors/main_error.vue";
import Small_error from "@/components/errors/small_error.vue";
import Avatar_display from "@/components/childComps/avatar_display.vue";

export default {
  name: "createUser",
  components: {Avatar_display, Small_error, Main_error},
  mixins: [commonMethods], // Подключаем миксин
  computed: {
    ...mapState(['error']),
  },
  data() {
    return {
      email: '',
      password: '',
      userName: '',
      errorMessage: '',
      description: '',
      avatar: null,
      avatarUrl: null,  // Для отображения изображения
    };

  },
  methods: {
    ...mapActions(['RegisterUser', 'RegisterAvatar']),

    onFileChange(event) {
      if (this.avatarUrl) {
        URL.revokeObjectURL(this.avatarUrl); // Освобождаем старый URL
      }
      const file = event.target.files[0];
      if (file) {
        this.avatar = file; // Присваиваем объект File в состояние компонента
        this.avatarUrl = URL.createObjectURL(file); // Генерируем URL для предварительного просмотра
        console.log('файл найден onFileChange(event)', this.avatar, 'URL:', this.avatarUrl)
      } else {
        console.log('ERROR onFileChange(event)')
      }
    },

    async register() {
      try {
        const isEmailValid = this.validateEmailMixin(this.email);
        const isPasswordValid = this.validatePasswordMixin(this.password);
        const isDescriptionValid = this.validateDescriptionMixin(this.description);
        if (isEmailValid && isPasswordValid && isDescriptionValid) {
          // Создаем объект с данными пользователя
          const userData = {
            email: this.email,
            password: this.password,
            userName: this.userName,
            description: this.description,
          };
          // Регистрируем пользователя
          const user = await this.RegisterUser(userData);
          // Если аватар загружен, загружаем его
          if (user) {
            if (this.avatar) {
              await this.RegisterAvatar({avatar: this.avatar, userId: user.id}); // Передаем аватар и ID пользователя
              console.log('дождались async register()')
            }
            this.$notyf.success({
              message: 'Регистрация прошла успешно!',
            });
            this.$router.push('/login');
          }
        }
      } catch (error) {
        console.log('Ошибка при регистрации:', error.message);
      }
    },
  }
}
</script>

<template>
  <div class="login-wrapper">
    <h2 class="bigText">Зарегистрироваться</h2>
    <form @submit.prevent="register" class="form">
      <div class="row">
        <label for="email" class="baseTextBold">Email:</label>
        <input class="inputs" type="email" v-model="email" @blur="validateEmailMixin(email)" required/>
      </div>

      <div class="row">
        <label for="password" class="baseTextBold">Пароль:</label>
        <input class="inputs" type="password" v-model="password" @blur="validatePasswordMixin(password)" required/>
      </div>
      <div class="row">
        <label for="userName" class="baseTextBold">Юзернейм:</label>
        <input class="inputs" type="text" v-model="userName" @blur="validatePasswordMixin(password)" required/>
      </div>
      <div class="row">
        <label for="userName" class="baseTextBold">Описание:</label>
        <input class="inputs" type="text" v-model="description" @blur="validateDescriptionMixin(description)" required/>
      </div>

      <div class="row">

        <label class="inputs large">
          Выбрать файл
          <input
              type="file"
              @change="onFileChange"
              accept="image/*"
          />
        </label>
        <img class="avatar-small" v-if="avatarUrl" :src="avatarUrl" alt="Аватар пользователя">
      </div>

      <div class="row">
        <button type="submit" class="btn primary">Создать</button>
        <router-link to="/login" v-slot="{navigate}" class="linksClear">
          <button class="btn danger" @click="navigate">Назад</button>
        </router-link>
      </div>

      <small_error v-if="error.small" :errorMsg="error.small"/>
    </form>
    <main_error v-if="error.normal" :errorMsg="error.normal"/>
  </div>

</template>

<style scoped lang="scss">

input[type="file"] {
  top: 0;
  left: 0;
  width: 130px;
  height: 30px;
  opacity: 0;
  cursor: pointer;
}

.inputs.large{
  width: 40%;
  height: 4em;
  border-radius: 5px;
  margin-left: 0;
}
</style>