<script>
import {mapActions} from "vuex";

export default {
  name: "deleteUser",
  data() {
    return {
      email: '',
      password: '',
      message: '',
      error: '',
    };
  },
  methods: {
    ...mapActions(['DeleteUser']),
    async deleteUser() {
      try {
        await this.DeleteUser({email: this.email, password: this.password});
        alert("User deleted successfully");
        this.email = '';
        this.password = '';
        this.$router.push('/login');
      } catch (error) {
        this.errorMessage = error.message;
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
        <input class="inputs" type="email" v-model="email" required/>
      </div>
      <div class="row">
        <label for="password" class="baseTextBold">Пароль:</label>
        <input class="inputs" type="password" v-model="password" required/>
      </div>
      <div class="row">
        <button type="submit" class="btn danger">Удалить</button>
        <router-link to="/editing" v-slot="{navigate}" class="linksClear">
          <button class="btn primary" @click="navigate">Назад</button>
        </router-link>
      </div>
      <!--      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>-->
    </form>

  </div>

</template>

<style scoped lang="scss">

</style>