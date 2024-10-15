<script>
import {mapActions} from "vuex";

export default {
  name: "createUser",
  computed: {
    /*...mapState(['user']),*/
    /*isValid() {
      return this.email !== '' && this.password !== ''
    },*/
  },
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
    };

  },
  methods:{
    ...mapActions(['RegisterUser']),
    async register(){
      try{
        await this.RegisterUser({email: this.email, password: this.password});
        alert("User registered successfully");
        this.email = '';
        this.password = '';
        this.$router.push('/login');
      }catch(error){
        this.errorMessage = error.message;
      }
    }
  }
}
</script>

<template>
  <div class="login-wrapper">
    <h2 class="bigText">Зарегистрироваться</h2>
    <form @submit.prevent="register" class="form">
      <div class="row">
        <label for="email" class="baseTextBold">Email:</label>
        <input class="inputs" type="email" v-model="email" required/>
      </div>
      <div class="row">
        <label for="password" class="baseTextBold">Пароль:</label>
        <input class="inputs" type="password" v-model="password" required/>
      </div>
      <div class="row">
        <button type="submit" class="btn primary">Создать</button>
        <router-link to="/login" v-slot="{navigate}" class="linksClear">
          <button class="btn danger" @click="navigate">Назад</button>
        </router-link>
      </div>

      <!--      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>-->
    </form>

<!--    <router-link to="/login" v-slot="{navigate}" class="linksText">
      <button class="btn primary" @click="navigate">return to enter</button>
    </router-link>-->
  </div>

</template>

<style scoped lang="scss">

</style>