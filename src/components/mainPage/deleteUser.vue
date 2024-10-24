<script>
import {mapActions} from "vuex";
import {commonMethods} from "@/components/mixins/commonMethods.js";

export default {
  name: "deleteUser",
  mixins: [commonMethods],
  data() {
    return {
      email: '',
      password: '',
      message: '',
      errorMessage: '',
    };
  },
  methods: {
    ...mapActions(['DeleteUser']),
    async deleteUser() {
      try {
        const ValidateEmail = this.validateEmailMixin(this.email);
        const ValidatePassword = this.validatePasswordMixin(this.password);
        if (ValidateEmail && ValidatePassword) {
          await this.DeleteUser({email: this.email, password: this.password});
          alert("User deleted successfully");
          this.email = '';
          this.password = '';
          this.$router.push('/login');
        }
      } catch (error) {
        const errorMessage = error.message || 'Ошибка при создании';
        this.$store.dispatch('handleError', {message: errorMessage}); // Отправляем ошибку в Vuex
      }
    },
  }
}
</script>

<template>
  <div class="login-wrapper">
    <h2 class="bigText">Удаление пользователя</h2>
    <form @submit.prevent="deleteUser">
      <div class="row">
        <label for="email" class="baseTextBold">Email:</label>
        <input class="inputs" type="email" v-model="email" @blur="validateEmailMixin(email)" required/>
      </div>
      <div class="row">
        <label for="password" class="baseTextBold">Пароль:</label>
        <input class="inputs" type="password" v-model="password" @blur="validatePasswordMixin(password)" required/>
      </div>
      <div class="row">
        <router-link to="/editing" v-slot="{navigate}" class="linksClear">
          <button class="btn primary" @click="navigate">Назад</button>
        </router-link>
        <button type="submit" class="btn danger">Удалить</button>
      </div>
      <p v-if="errorMessage" class="errorClass">{{ errorMessage }}</p>
    </form>

  </div>

</template>

<style scoped lang="scss">

</style>