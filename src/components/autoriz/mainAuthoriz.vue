<script>
import {mapActions} from "vuex";

export default {
  name: "mainAuthoriz",
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
    }
  },
  computed: {
    isValid() {
      return this.email !== '' && this.password !== ''
    },
  },
  methods: {
    submit() {
      if (this.isValid) {
        this.login({email: this.email, password: this.password})
            .then(() => {
              // Если авторизация успешна
              this.$router.push('/mainPage'); // перенаправить пользователя на другую страницу, если требуется
            })
            .catch((error) => {
              // Обработка ошибки
              this.errorMessage = error.message || 'Ошибка при авторизации';
            });
      }
    },
    ...mapActions(['login'])
  },
}
</script>

<template>
  <div class="login-wrapper">
    <h2 class="bigText">Авторизация</h2>

    <form @submit.prevent="submit" class="form">
      <div class="row">
        <label for="email" class="baseTextBold">Email:</label>
        <input class="inputs" type="email" v-model="email" required/>
      </div>
      <div class="row">
        <label for="password" class="baseTextBold">Пароль:</label>
        <input class="inputs" type="password" v-model="password" required/>
      </div>
      <div class="row">
        <button type="submit" class="btn primary">Войти</button>
        <!--      //if dont work make it ourside this div-->
        <router-link to="/creating" v-slot="{navigate}" class="linksClear">
          <button class="btn primary" @click="navigate">Нет аккаунта?</button>
        </router-link>
      </div>

      <!--      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>-->
    </form>
    <!--    <router-link to="/creating" v-slot="{navigate}" class="linksClear">
        <button class="btn primary" @click="navigate">еще не зареган</button>
        </router-link>-->

  </div>
</template>

<style lang="scss">
@import '../../assets/styles';
.form{
  width:70%;
}
.row {
  @include flex-center-row;
  width:90%;
  align-items: flex-start;
  margin-top:1em;
  justify-content: space-between;
}

</style>