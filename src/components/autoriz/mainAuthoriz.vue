<script>
import {mapActions, mapState} from "vuex";
import {commonMethods} from "@/components/mixins/commonMethods.js";
import TheMainLoader from "@/components/loading/TheMainLoader.vue";
import Main_error from "@/components/errors/main_error.vue";
import Small_error from "@/components/errors/small_error.vue";

export default {
  name: "mainAuthoriz",
  components: {Small_error, Main_error, TheMainLoader},
  mixins: [commonMethods],
  data() {
    return {
      email: '',
      password: '',
    }
  },
  computed: {
    ...mapState(['error']),
  },
  methods: {
    submit() {
      const isEmailValid = this.validateEmailMixin(this.email);
      const isPasswordValid = this.validatePasswordMixin(this.password);

      if (isEmailValid && isPasswordValid) {
        this.login({email: this.email, password: this.password})
            .then(() => {
              // Если авторизация успешна
              this.$router.push({ name: 'mainPageWithSlug' });
            })
            .catch((error) => {
              const errorMessage = error.message || 'Ошибка при авторизации';
              this.$store.dispatch('handleError', {type:'small', message: errorMessage}); // Отправляем ошибку в Vuex
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
        <router-link to="/creating" v-slot="{navigate}" class="linksClear">
          <button class="btn primary" @click="navigate">Нет аккаунта?</button>
        </router-link>
      </div>
        <small_error v-if="error.small" :errorMsg="error.small"/>
    </form>

    <main_error v-if="error.normal" :errorMsg="error.normal"/>

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