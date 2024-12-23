<script>
import Like_svg from "@/components/svg/like_svg.vue";
import Commentary_svg from "@/components/svg/commentary_svg.vue";
import Save_svg from "@/components/svg/save_svg.vue";
import Send_svg from "@/components/svg/send_svg.vue";
import {mapGetters, mapState} from "vuex";
import Delete_svg from "@/components/svg/delete_svg.vue";
import Swal from "sweetalert2";

export default {
  name: "actions",
  components: {Delete_svg, Send_svg, Save_svg, Commentary_svg, Like_svg},
  ...mapState(['allPosts', 'user', 'likedPosts', 'savedPosts', 'comments',]),

  mounted() {
  },

  computed: {
    isLiked() {
      const user = this.$store.state.user;
      const likedPosts = this.$store.state.likedPosts;
      // Проверяем, что user и likedPosts загружены
      if (!user || !likedPosts) {
        console.error("User data is not loaded.");
      }
      const userId = user.id; // текущий пользователь
      return likedPosts[userId]?.includes(this.post_id) || false;

    },
    isSaved() {
      const user = this.$store.state.user;
      const savedPosts = this.$store.state.savedPosts;
      if (!user || !savedPosts) {
        console.error("User data is not loaded.");
      }
      const userId = user.id; // текущий пользователь
      return savedPosts[userId]?.includes(this.post_id) || false;
    },
    currentUserId() {
      return this.$store.state.user.id; // Получаем ID текущего пользователя из Vuex
    },

    ...mapGetters(['getCommentCount']),
    commentCount() {
      return this.getCommentCount(this.post_id);
    }
  },
  props: { //from postsRek
    post_likes: {
      type: Number,
      required: true
    },
    post_id: {
      type: Number,
      required: true
    },
    post_savings: {
      type: Number,
      required: true
    },
    post_userId:{
      type: Number,
      required: true
    }
  },
  data() {
  },
  methods: {
    likePost(postId) {
      const userId = this.$store.state.user.id; // текущий userId
      if (this.isLiked) {
        this.$store.dispatch('unlikePost', {postId, userId});
      } else {
        this.$store.dispatch('likePost', {postId, userId});
      }
    },
    savePost(postId) {
      const userId = this.$store.state.user.id; //  текущий userId
      if (this.isSaved) {
        this.$store.dispatch('unsavePost', {postId, userId});
      } else {
        this.$store.dispatch('savePost', {postId, userId});
      }
    },
    openComms(postId){
        this.$emit('openComms',postId);

    },

    showDeleteConfirmation(postId) {
      Swal.fire({
        title: "Вы уверены?",
        text: "Это действие невозможно отменить!",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Удалить",
        cancelButtonText: "Отмена",
        customClass: {
          popup: 'app-modalWrap', // Для всего окна
          title: 'baseTextBold', // Для текста заголовка
          confirmButton: 'btn success', // Для кнопки подтверждения
          cancelButton: 'btn danger', // Для кнопки отмены
          text: 'baseText'
        },

      }).then((result) => {
        if (result.isConfirmed) {
          this.deletePost(postId);
        }
      });
    },
    async deletePost(postId) {
      try {
        await this.$store.dispatch('deletePost', {postId});
        this.$notyf.error({
          message: 'Ваш пост удален!',
        });
        console.log(`deletepost`, postId);
        this.$store.dispatch('fetchAllPosts'); // Загрузка всех постов
      } catch (error) {
        console.error('Ошибка при удалении posta:', error);
      }

    },
  },
}
</script>

<template>

  <div class="actions actionsContainer">
    <like_svg class="svg-header danger"  @click="likePost(post_id)" :class="{isLikedStyle: isLiked, greyColor: !isLiked}"></like_svg>
    <p class="baseTextBold greyColor">
      {{ post_likes }}
    </p>

    <commentary_svg class="svg-header"  @click="openComms(post_id)"></commentary_svg>
    <p class="baseTextBold greyColor">
      {{commentCount}}
    </p>
    <save_svg class="svg-header" @click="savePost(post_id)" :class="{isSavedStyle: isSaved, greyColor: !isSaved}"></save_svg>
    <p class="baseTextBold greyColor">
      {{ post_savings }}
    </p>
    <send_svg ></send_svg>

    <delete_svg class="svg-header danger" v-if="post_userId === currentUserId" @click="showDeleteConfirmation(post_id)"></delete_svg>

  </div>
</template>

<style scoped lang="scss">
.actionsContainer {
  width: 15em;
  padding: 0;
  display: flex;
  justify-content: space-between;
}

.greyColor {
  color: var(--vt-c-grey-light);
}

.isLikedStyle {
  color: #ec3f3f;
  transition: 0.3s ease-in-out;
}
.isSavedStyle {
  color: var(--vt-c-accent-color);
  transition: 0.3s ease-in-out;
}

</style>