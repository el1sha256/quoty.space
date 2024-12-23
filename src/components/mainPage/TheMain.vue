<script>
import UserSmall from "@/components/mainPage/UserSmall.vue";
import TheCategories from "@/components/mainPage/TheCategories.vue";
import TheWriter from "@/components/mainPage/TheWriter.vue";
import PostsUser from "@/components/posts_plate/postsUser.vue";
import PostsRek from "@/components/posts_plate/postsRek.vue";
import {mapActions, mapMutations, mapState} from "vuex";
import TheLoading from "@/components/loading/TheLoading.vue";
import TheMainLoader from "@/components/loading/TheMainLoader.vue";
import TheLoadingPlashki from "@/components/loading/TheLoadingPlashki.vue";

export default {
  name: "TheMain",
  components: {TheLoadingPlashki, TheMainLoader, TheLoading, PostsUser, TheWriter, TheCategories, UserSmall, PostsRek},
  computed: {
    is_loading_posts() { //загрузка постов
      return this.$store.state.isLoading.posts;
    },
    is_loading_user() { //загрузка постов
      return this.$store.state.isLoading.user;
    },
    is_loading_categories() {
      return this.$store.state.isLoading.categories;
    }
  },
  mounted() { //при перезагрузке странички
    this.$store.dispatch('restoreUser'); // Вызов метода для восстановления пользователя при монтировании компонента
    this.$store.dispatch('fetchUsers');
    this.$store.dispatch('fetchAllPosts'); // Загрузка всех постов
  },

  watch: {
    // Наблюдаем за изменением параметра маршрута
    $route: {
      immediate: true,
      handler(newRoute) {
        const category = newRoute.params.category || null;
        this.setSelectedCategory(category); // Устанавливаем категорию в Vuex
        this.fetchAllPosts(); // Загружаем посты
      },
    },
  },

  provide() {
    return {
      validateEmail:this.validateEmail
    }
  },
  created() {
    this.$store.dispatch('restoreUser');
  },
  methods:{
    ...mapMutations(['setSelectedCategory']),
    ...mapActions(['fetchAllPosts']),
    validateEmail(){
      const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
      if (!gmailRegex.test(this.email)) {
        this.errorMessage = 'Email должен быть на домене @gmail.com';
        return false;
      }else{
        return true;
      }
    },
    handleOpenWriter(){
      this.isWriterVisible = !this.isWriterVisible; // Переключение видимости
    },
  },
  data(){
    return{
      isWriterVisible: false, // Управление видимостью TheWriter

    }
  }

}
</script>

<template>
  <div class="container-main">
    <TheLoadingPlashki v-if="is_loading_user"
                :isLoading="is_loading_user" :num-of-things="1" type="column"/>
    <user-small v-else @openWriter="handleOpenWriter"></user-small>
    <TheLoadingPlashki v-if="is_loading_categories"
                       :isLoading="is_loading_categories" :num-of-things="3" type="row"/>
    <the-categories></the-categories>



    <transition-group name="fade-scale" tag="div">
        <TheWriter v-if="isWriterVisible" ></TheWriter>

    <TheLoading v-if="is_loading_posts" message="Посты загружаются, пожалуйста, подождите..."
                  :isLoading="is_loading_posts"/>
    <postsRek v-show="!is_loading_posts"></postsRek>
    </transition-group>

  </div>
</template>

<style scoped>
/* Анимация появления и исчезновения */
.fade-scale-enter-active, .fade-scale-leave-active {
  transition: opacity 0.1s, transform 0.4s, height 0.5s ease-out, margin 0.5s ease-out;
  overflow: hidden;
}

.fade-scale-enter-from {
  opacity: 1;
  transform: scale(1.3);
  max-height: 0;
  margin-top: 0;
}

.fade-scale-leave-to {
  opacity: 0;
  transform: scale(1.3);
  max-height: 0;
  margin-top: -4.5em;
}
</style>