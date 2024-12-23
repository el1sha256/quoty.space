<script setup>
import TheMain from "@/components/mainPage/TheMain.vue";
import TheHeader from "@/components/mainPage/TheHeader.vue";
import TheMainSearch from "@/components/SearchPage/TheMainSearch.vue";
import MainAuthoriz from "@/components/autoriz/mainAuthoriz.vue";
import TheMainLoader from "@/components/loading/TheMainLoader.vue";
import TheLoadingPlashki from "@/components/loading/TheLoadingPlashki.vue";

/*import { inject } from 'vue';*/

import { useStore } from 'vuex';
import { computed, onMounted } from 'vue';
// Получаем доступ к store
const store = useStore();

/*const toast = inject('$toast');  // Получаем доступ к toast*/

// Используем computed для получения состояния загрузки из Vuex
const isLoadingGlobal = computed(() => store.state.isLoading.global);


</script>

<template>
  <header>
      <TheHeader></TheHeader>
  </header>

  <main>
<!--    //бесконечная загрузка-->
    <the-main-loader v-if="isLoadingGlobal" :isLoading="isLoadingGlobal" message="Загрузка приложения..."></the-main-loader>
    <router-view v-show="!isLoadingGlobal"></router-view> <!--//отображаем другие странички-->
  </main>
</template>

<style scoped>

header {
  line-height: 1.5;
  /*width: 50%;*/
  justify-content: center;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
    width: 100%;
    height: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
