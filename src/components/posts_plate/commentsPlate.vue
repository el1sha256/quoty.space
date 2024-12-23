<script>
import commentContent from "@/components/posts_plate/commentContent.vue";
import {mapState} from "vuex";
import UserInfo from "@/components/posts_plate/userInfo.vue";
import CommentsWriter from "@/components/posts_plate/commentsWriter.vue";
import Swal from "sweetalert2";

export default {
  name: "comments",
  components: {CommentsWriter, UserInfo, commentContent},
  computed: {
    ...mapState(['comments', 'user', 'userName', 'avatar', 'users',]),
    currentUserId() {
      return this.$store.state.user.id; // Получаем ID текущего пользователя из Vuex
    },

  },
  mounted() { //при перезагрузке странички

    this.$store.dispatch('fetchUsers');

  },

  methods: {
    showDeleteConfirmation(commentId) {
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
          this.deleteComm(commentId);
        }
      });
    },

    async deleteComm(commentId) {
      const postId = this.$store.state.openCommentsPostId;
      try {
        await this.$store.dispatch('deleteComment', {postId, commentId});
        console.log(`deleteComm`, postId , commentId );
        console.log(`Комментарий с ID ${commentId} удалён`);
        this.$notyf.error({
          message: 'Ваш комментарий удален!',
        });
        this.$store.dispatch('loadComments', postId);
      } catch (error) {
        console.error('Ошибка при удалении комментария:', error);
      }
    }
  },
  props: {
    comments: { //передано из postsRek
      required: true,
    },
  },
}
</script>

<template>
  <div class="commentsContainer">

    <div v-for="comment in comments" :key="comment.id">
      <commentContent :commentContent="comment"/>
      <button v-if="comment.userId === currentUserId" @click="showDeleteConfirmation(comment.id)" class="btn btnComments">Удалить</button>
    </div>
    <commentsWriter/>
  </div>
</template>

<style scoped lang="scss">
.commentsContainer {
  width: 100%;
  height: auto;
  padding: 0;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: flex-start;
}

.avatar-placeholder {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #dcdcdc;
}

.text-placeholder {
  flex: 1;
  height: 20px;
  background: #e0e0e0;
  border-radius: 4px;
}

@keyframes pulse {
  0% {
    background-color: #f0f0f0;
  }
  50% {
    background-color: #e0e0e0;
  }
  100% {
    background-color: #f0f0f0;
  }
}
</style>