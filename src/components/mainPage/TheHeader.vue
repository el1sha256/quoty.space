<script>
import {mapActions, mapState} from "vuex";
import Home_svg from "@/components/svg/home_svg.vue";
import Search_svg from "@/components/svg/search_svg.vue";
import User_svg from "@/components/svg/user_svg.vue";
import Like_big_svg from "@/components/svg/like_big_svg.vue";
import Logout_svg from "@/components/svg/logout_svg.vue";

export default {
  name: "TheHeader",
  components: {Logout_svg, Like_big_svg, User_svg, Search_svg, Home_svg},

  mounted() {

    const observer = new MutationObserver((mutations) => {
      const elements = document.querySelectorAll(".svg-header");
      if (elements.length > 0) {
        observer.disconnect(); // Остановить наблюдение
        this.animateIcons(elements); // Запустить анимацию
      }
    });
    const targetNode = document.querySelector(".headerContainer");
    if (targetNode) {
      observer.observe(targetNode, { childList: true, subtree: true });
    }
  },
  computed: {
    ...mapState(['isLoggedIn']),

  },
  methods: {
    ...mapActions(['logout']),
    animateIcons(elements) {
      const tl = this.$gsap.timeline();
      elements.forEach((element, index) => {
        tl.fromTo(element,
            { opacity: 0 }, // Начальное состояние
            {keyframes: [
            { y: 0, opacity: 0, duration: 0.4, ease: "power1.out" }, // Начальная позиция
            { y: -40, opacity: 0.5, duration: 0.2, ease: "bounce.out" }, // Плавное возвращение
            { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" }, // Завершающая стабилизация
          ],
              stagger: 0.4, //задержки между анимациями
        },
        );
      });
    },
  },


}
</script>

<template>
  <div class="headerContainer">

    <like_big_svg v-if="isLoggedIn"/>
    <search_svg v-if="isLoggedIn"/>
    <img alt="logo" class="logo" src="../../assets/logo.svg" width="125" height="125"  @click.prevent="this.$router.push('/mainPage');"/>
    <user_svg v-if="isLoggedIn"/>
    <logout_svg v-if="isLoggedIn" @click.prevent="this.logout(this.$router)"/>

  </div>
</template>

<style scoped lang="scss">
@import '../../assets/styles';

.headerContainer {
  @include flex-center-row;
  width: 50%;
  justify-content: space-evenly;
  align-items: center;
}

</style>