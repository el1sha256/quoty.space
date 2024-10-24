<script>
import UserSmall from "@/components/mainPage/UserSmall.vue";
import TheCategories from "@/components/mainPage/TheCategories.vue";
import {categoryData} from "@/components/Categories.js";
import {userData} from "@/components/users.js";
import UserText from "@/components/mainPage/UserText.vue";
import TheWriter from "@/components/mainPage/TheWriter.vue";

export default {
  name: "TheMain",
  components: {TheWriter, UserText, TheCategories, UserSmall},
  provide() {
    return {
      categories: categoryData.categories, //idk wth
      users: userData.users, //idk wth
      validateEmail:this.validateEmail
    }
  },
  methods:{
    validateEmail(){
      const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
      if (!gmailRegex.test(this.email)) {
        this.errorMessage = 'Email должен быть на домене @gmail.com';
        return false;
      }else{
        return true;
      }
    }
  }

}
</script>

<template>
  <div class="container-main">
    <user-small></user-small>
    <the-categories></the-categories>
    <user-text></user-text>

    <TheWriter></TheWriter>
  </div>
</template>

<style scoped>

</style>