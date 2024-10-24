<script>
import {mapActions} from "vuex";
import {commonMethods} from '../mixins/commonMethods';

export default {
  name: "createUser",
  mixins: [commonMethods], // Подключаем миксин
  computed: {},
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
    ...mapActions(['RegisterUser','RegisterAvatar']),

    onFileChange(event) {
      const file = event.target.files[0];
      this.avatar = file; // Сохраняем объект File
      this.avatarUrl = URL.createObjectURL(file); // Для отображения выбранного файла
    },

  /*  async register() {
      try {

        const isEmailValid = this.validateEmailMixin(this.email);
        const isPasswordValid = this.validatePasswordMixin(this.password);
        const isDescriptionValid = this.validateDescriptionMixin(this.description);

        if (isEmailValid && isPasswordValid && isDescriptionValid) {

          await this.RegisterUser({
            email: this.email,
            password: this.password,
            userName: this.userName,
            description: this.description,
          });
          alert("User registered successfully");
          this.email = '';
          this.password = '';
          this.userName = '';
          this.description = '';
          this.avatar = null;
          this.$router.push('/login');
        }
      } catch (error) {
        const errorMessage = error.message || 'Ошибка при создании';
        this.$store.dispatch('handleError', {message: errorMessage}); // Отправляем ошибку в Vuex
      }
    },
    async handleAvatarUpload(){
      const avatarData = { avatar: this.avatar }; // Создаем объект с аватаром
      try{
       /!* await this.RegisterAvatar(avatarData); // Передаем объект в Vuex экшен*!/
        await this.$store.dispatch('RegisterAvatar', avatarData); // Передаем объект в Vuex экшен
        console.log('Аватар загружен успешно');
      }catch(error){
        const errorMessage = error.message || 'Ошибка при создании';
        this.$store.dispatch('handleError', {message: errorMessage}); // Отправляем ошибку в Vuex
      }
    },*/



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
            avatar: this.avatar,
          };
          // Регистрируем пользователя
          const user = await this.RegisterUser(userData);
          // Если аватар загружен, загружаем его
          if (this.avatar) {
            await this.RegisterAvatar({ avatar: this.avatar, userId: user.id }); // Передаем аватар и ID пользователя
          }
          alert("Пользователь успешно зарегистрирован");
          this.$router.push('/login');
        }
      } catch (error) {
        const errorMessage = error.message || 'Ошибка при регистрации';
        this.$store.dispatch('handleError', { message: errorMessage }); // Отправляем ошибку в Vuex
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
<!--      <v-file-input
          style="background-color: #2c3e50"
          v-model="avatar"
          label="Выберите аватар"
          accept="image/*"
          prepend-icon="mdi-camera"
          @change="onFileChange"
      >-->
        <div class="row">
          <input
              type="file"
              @change="onFileChange"
              accept="image/*"
              style="color: #2c3e50"
          />
          <img v-if="avatarUrl" :src="avatarUrl" alt="Аватар пользователя" style="max-width: 200px;">
        </div>
      </div>


<!--      <form @submit.prevent="handleAvatarUpload">
        <input
            type="file"
            @change="onFileChange"
            accept="image/*"
            style="color: #2c3e50"
            required
        />
        <img v-if="avatarUrl" :src="avatarUrl" alt="Аватар пользователя" style="max-width: 200px;">
        <button type="submit">Загрузить аватар</button>
      </form>-->


      <div class="row">
        <button type="submit" class="btn primary">Создать</button>
        <router-link to="/login" v-slot="{navigate}" class="linksClear">
          <button class="btn danger" @click="navigate">Назад</button>
        </router-link>
      </div>



      <p v-if="errorMessage" class="errorClass">{{ errorMessage }}</p>
    </form>

    <!--    <router-link to="/login" v-slot="{navigate}" class="linksText">
          <button class="btn primary" @click="navigate">return to enter</button>
        </router-link>-->


<!--    <form @submit.prevent="register" class="form">



    </form>-->
  </div>

</template>

<style scoped lang="scss">

</style>