<script>
import {mapActions} from "vuex";
import{commonMethods} from "@/components/mixins/commonMethods.js";

export default {
  name: "accountInfoEdit",
  mixins: [commonMethods],
  computed: {
    isValid() {
      return this.email !== '' && this.password !== ''
    },
  },
  methods: {
    ...mapActions(['logout', 'restoreUser']),
    updateUserData() {
      const isEmailValid = this.validateEmailMixin(this.email);
      const isPasswordValid = this.validatePasswordMixin(this.password);
      const isDescriptionValid = this.validateDescriptionMixin(this.description);

      if (this.isValid && isEmailValid && isPasswordValid) {
        this.$store.dispatch('UpdateUser', { email: this.email, password: this.password, userName: this.userName, description: this.description })
            .then(() => {
              alert('Данные пользователя успешно обновлены!');
            })
            .catch((error) => {
              const errorMessage = error.message || 'Ошибка при создании';
              this.$store.dispatch('handleError', { message: errorMessage }); // Отправляем ошибку в Vuex
            });
      } else {
      }
    },
  },
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
      userName:'',
      description:'',
    }
  },

}
</script>

<template>
    <div class="login-wrapper editing">
      <h2 class="bigText">Изменить данные</h2>
    <form @submit.prevent="updateUserData" class="form">
      <div class="row">
        <label for="email" class="baseTextBold">Новый Email:</label>
        <input class="inputs" type="email" v-model="email" @blur="validateEmailMixin(email)" required/>
      </div>
      <div class="row">
        <label for="password" class="baseTextBold">Новый ник:</label>
        <input class="inputs" type="text" v-model="userName"/>
      </div>
      <div class="row">
        <label for="password" class="baseTextBold">Описание:</label>
        <input class="inputs" type="text" v-model="description" @blur="validateDescriptionMixin(description)"/>
      </div>
      <div class="row">
        <label for="password" class="baseTextBold">Новый пароль:</label>
        <input class="inputs" type="password" v-model="password" @blur="validatePasswordMixin(password)"/>
      </div>
      <div class="row">
        <router-link to="/mainPage" v-slot="{navigate}" class="linksClear">
          <button class="btn danger" @click="navigate">Назад</button>
        </router-link>
        <button type="submit" class="btn primary">Сохранить изменения</button>
        <router-link to="/deleting" v-slot="{navigate}" class="linksClear">
          <button class="btn danger" @click="navigate">снести аккаунт нахуй</button>
        </router-link>
      </div>
      <p v-if="errorMessage" class="errorClass">{{ errorMessage }}</p>
    </form>

  </div>
</template>

<style scoped lang="scss">
.login-wrapper.editing{
  width: 47em;
  height: 25em;
}
</style>