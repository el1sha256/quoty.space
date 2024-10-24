<script>
import {mapActions} from "vuex";
import {commonMethods} from "@/components/mixins/commonMethods.js";

export default {
  name: "mainAuthoriz",
  mixins: [commonMethods],
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
    }
  },
  computed: {
    /*isValid() {
      return this.email !== '' && this.password !== ''
    },*/
  },
  methods: {
    submit() {
      const isEmailValid = this.validateEmailMixin(this.email);
      const isPasswordValid = this.validatePasswordMixin(this.password);

      if (isEmailValid && isPasswordValid) {
        this.login({email: this.email, password: this.password})
            .then(() => {
              // Если авторизация успешна
              this.$router.push('/mainPage'); // перенаправить пользователя на другую страницу, если требуется
            })
            .catch((error) => {
              const errorMessage = error.message || 'Ошибка при авторизации';
              this.$store.dispatch('handleError', {message: errorMessage}); // Отправляем ошибку в Vuex
              //this.$store: Это доступ к объекту Vuex-хранилища (store), который подключён ко всему приложению. Когда вы используете Vuex, Vue автоматически предоставляет объект хранилища во всех компонентах через this.$store.
              //dispatch: Это метод Vuex, который используется для вызова действий (actions) из хранилища. В отличие от мутаций, действия могут выполнять асинхронные операции, такие как запросы к серверу или сложную бизнес-логику
            });
      }
    },
    ...mapActions(['login']),
  },
}
</script>

<template>
  <div class="login-wrapper">
    <h2 class="bigText">Авторизация</h2>

    <form @submit.prevent="submit" class="form">
      <div class="row">
        <label for="email" class="baseTextBold">Email:</label>
        <input class="inputs" type="email" v-model="email" @blur="validateEmailMixin(email)" required/>
      </div>
      <div class="row">
        <label for="password" class="baseTextBold">Пароль:</label>
        <input class="inputs" type="password" v-model="password" @blur="validatePasswordMixin(password)" required/>
      </div>
      <div class="row">
        <button type="submit" class="btn primary">Войти</button>
        <!--      //if dont work make it ourside this div-->
        <router-link to="/creating" v-slot="{navigate}" class="linksClear">
          <button class="btn primary" @click="navigate">Нет аккаунта?</button>
        </router-link>
      </div>
      >
      <p v-if="errorMessage" class="errorClass">{{ errorMessage }}</p>

    </form>
    <!--    <router-link to="/creating" v-slot="{navigate}" class="linksClear">
        <button class="btn primary" @click="navigate">еще не зарган</button>
        </router-link>-->

  </div>
</template>

<style lang="scss">
@import '../../assets/styles';

.form {
  width: 70%;
}

.row {
  @include flex-center-row;
  width: 90%;
  align-items: flex-start;
  margin-top: 1em;
  justify-content: space-between;
}

</style>