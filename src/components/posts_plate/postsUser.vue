<script>
import {mapActions, mapState} from "vuex";

export default {
  name: "posts",
  computed: {
    ...mapState(['posts','user', 'userName', 'avatar']),
  },
  data() {
    return {
      is_loading: true,
    }
  },
  methods: {
    ...mapActions(['restoreUser']),
  },
}
</script>

<template>
  <div class="posts_wrapper">
    <div class="posts_header_userInfo">



      <div class="avatar">
      </div>
      <div class="User-small-main-text">
          <h2>{{ user ? user.userName : 'Loading...' }}</h2>
          <p>{{ user ? user.description : '' }}</p>
          <p>{{ user ? user.token : '' }}</p>
      </div>
    </div>
    <h2>Мои посты</h2>
    <div v-for="post in posts" :key="post.id">{{ post.content }}</div>
  </div>
</template>

<style scoped lang="scss">
.posts_wrapper {
  background: yellowgreen;
  height: 80vh;
}
</style>