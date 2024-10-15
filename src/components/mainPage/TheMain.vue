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
      categories: categoryData.categories,
      users: userData.users,
    }
  },
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