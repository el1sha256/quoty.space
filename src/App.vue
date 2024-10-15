<script setup>
import TheMain from "@/components/mainPage/TheMain.vue";
import TheHeader from "@/components/mainPage/TheHeader.vue";
import TheMainSearch from "@/components/SearchPage/TheMainSearch.vue";
import MainAuthoriz from "@/components/autoriz/mainAuthoriz.vue";
</script>

<template>
  <header>
    <!--    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />-->
<!--    <div class="header">-->
      <TheHeader></TheHeader>
<!--    </div>-->

<!--    <div class="wrapper">
    </div>-->
  </header>

  <main>
    <router-view></router-view>
<!--    <MainAuthoriz></MainAuthoriz>
    <TheMain></TheMain>
    <TheMainSearch></TheMainSearch>-->
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
