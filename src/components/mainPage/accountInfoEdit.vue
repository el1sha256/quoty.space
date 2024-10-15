<script>
import {mapActions, mapState} from "vuex";

export default {
  name: "accountInfoEdit",
  computed: {
    /*...mapState(['user']),*/
    isValid() {
      return this.email !== '' && this.password !== ''
    },
  },
  methods: {
    ...mapActions(['logout', 'restoreUser']),
    updateUserData() {
      if (this.isValid) {
        this.$store.dispatch('UpdateUser', { email: this.email, password: this.password })
            .then(() => {
              alert('Данные пользователя успешно обновлены!');
            })
            .catch((error) => {
              this.errorMessage = error.message || 'Ошибка при обновлении данных пользователя';
            });
      } else {
        this.errorMessage = 'Пожалуйста, проверьте введенные данные'; // Убедитесь, что валидация правильная
      }
    },
  },
  data() {
    return {
      email: '', //new ones
      password: '',
      errorMessage: '',
    }
  },

}
</script>

<template>
<!--    <h2>{{ user ? user.email : 'Loading...' }}</h2>
    <p>{{ user ? user.bio : '' }}</p>
    <p>{{ user ? user.token : '' }}</p>-->

    <div class="login-wrapper editing">
      <h2 class="bigText">Изменить данные</h2>
    <form @submit.prevent="updateUserData" class="form">
      <div class="row">
        <label for="email" class="baseTextBold">Новый Email:</label>
        <input class="inputs" type="email" v-model="email" required/>
      </div>
      <div class="row">
        <label for="password" class="baseTextBold">Новый пароль:</label>
        <input class="inputs" type="password" v-model="password"/>
      </div>
      <div class="row">
        <button type="submit" class="btn primary">Сохранить изменения</button>
        <router-link to="/mainPage" v-slot="{navigate}" class="linksClear">
          <button class="btn danger" @click="navigate">Назад</button>
        </router-link>
        <router-link to="/deleting" v-slot="{navigate}" class="linksClear">
          <button class="btn danger" @click="navigate">снести аккаунт нахуй</button>
        </router-link>
      </div>
<!--      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>-->
    </form>

  </div>
</template>

<style scoped lang="scss">
.login-wrapper.editing{
  width: 47em;
  height: 25em;
}
</style>