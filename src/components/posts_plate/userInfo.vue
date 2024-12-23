<script>
import {commonMethods} from "@/components/mixins/commonMethods.js";
import Avatar_display from "@/components/childComps/avatar_display.vue";
/*import {query} from "express";*/

export default {
  name: "userInfo",
  components: {Avatar_display},

  props: { //user whose post is
    user: {
      type: Object,
      required: true
    }
  },
  computed: {
    currentUserId() {
      return this.$store.state.user.id; // Получаем ID текущего пользователя из Vuex
    },
  },
  data() {
  },
  methods: {
    routeUser() {

      if (this.user.id === this.currentUserId) {
        this.$router.push('/editing')
      }else{
        this.$router.push({ path: '/information', query: { userId: this.user.id } });

      }
    }
  },
}
</script>

<template>
  <div @click="routeUser" class="posts-ava-more">
    <avatar_display :user="{ avatar: user.avatar, name: user.name }" type="normal"></avatar_display>


    <div class="linksText">
      <div class="User-small-main-text">
        <h2 class="User-small-userName">{{ user.name }}</h2>
        <p class="User-small-description">{{ user.description }}</p>
      </div>
    </div>
  </div>

</template>

<style scoped lang="scss">
.posts-ava-more {
  margin-top: 2em;

  display: flex;
  flex-direction: row;
}

.posts-ava-more.svg {
  align-items: flex-end;
  justify-content: flex-end;
}
</style>