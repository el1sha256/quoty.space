<script>
import {mapActions, mapState} from "vuex";
import Actions from "@/components/posts_plate/actions.vue";
import PostContent from "@/components/posts_plate/postContent.vue";
import UserInfo from "@/components/posts_plate/userInfo.vue";
import CommentsPlate from "@/components/posts_plate/commentsPlate.vue";
import TheLoading from "@/components/loading/TheLoading.vue";
import TheLoadingPlashki from "@/components/loading/TheLoadingPlashki.vue";
import Small_error from "@/components/errors/small_error.vue";

export default {
  name: "posts",
  components: {Small_error, TheLoadingPlashki, CommentsPlate, UserInfo, PostContent, Actions, TheLoading},
  computed: {
    ...mapState(['allPosts', 'user', 'userName', 'avatar', 'users', 'savedPosts','error']), //massive 'comments' is EMPTY and NOT used //comments liegt im allPosts massive comments
    is_loading() { //загрузка коммов
      return this.$store.state.isLoading.comments;
    },
  },
  mounted() { //при перезагрузке странички

    this.$store.dispatch('fetchUsers');
    this.$store.dispatch('fetchAllPosts'); // Загрузка всех постов
  },
  data() {
    return {
      openCommentsPostId: null,   // ID поста с открытыми комментариям
      loadingPostId: this.$store.state.loadingPostId,
    }
  },
  methods: {
    getUserInfo(userId) {
      const user = this.users.find(user => user.id === userId); // Находим пользователя по userId
      return user ? {
        name: user.userName,
        description: user.description,
        avatar: user.avatar,
        id: userId
      } : {
        name: 'Неизвестный пользователь',
        description: 'qqwert',
        avatar: null,
        id: null
      }; // Возвращаем объект с информацией о пользователе или значение по умолчанию
    },

    async openCommsHandle(postId) {
      try {
        // Если комментарии уже открыты, закрываем их
        if (this.openCommentsPostId === postId) {
          this.openCommentsPostId = null;
          this.$store.commit('setOpenCommentsPostId', null);
          return; // Заканчиваем выполнение метода
        }
        // Открываем комментарии для нового поста
        this.openCommentsPostId = postId;
        this.$store.commit('setOpenCommentsPostId', postId);
        // Загружаем комментарии, если они ещё не загружены
        if (!this.$store.state.loadingPostId || this.$store.state.loadingPostId !== postId) {
          this.$store.commit('setLoadingPostId', postId);
          const comments = await this.$store.dispatch('loadComments', postId);
          console.log(`Комментарии для поста ${postId} загружены:`, comments);
        }
      } catch (error) {
        const errorMessage = error.message || 'Ошибка при загрузке комментариев';
        this.$store.dispatch('handleError', {message: errorMessage});
      } finally {
        // Сбрасываем флаг загрузки после завершения
        if (this.$store.state.loadingPostId === postId) {
          this.$store.commit('setLoadingPostId', null);
        }
      }
    }
  },
}
</script>

<template>
  <div class="posts_wrapper" >

      <div v-for="post in allPosts" :key="post.id" class="posts-container" data-aos="fade-up">
        <user-info :user="getUserInfo(post.userId)"/>
        <post-content :content="post.content"/>
        <actions class="actions" :post_likes="post.likes" :post_id="post.id" :post_savings="post.savings" :post_userId="post.userId"
                 @openComms="openCommsHandle(post.id)"/>

        <div v-if="!is_loading">
          <commentsPlate v-if="openCommentsPostId === post.id" class="comments" :isLoading="true"
                         :comments="post.comments"/>
        </div>
        <TheLoadingPlashki v-if="openCommentsPostId === post.id && is_loading" :isLoading="is_loading" :num-of-things="3" type="column"/>

      </div>


    <div v-if="allPosts.length === 0">Нет постов для данной категории.</div>
    <small_error v-if="error.small" :errorMsg="error.small"/>

    </div>
</template>

<style scoped lang="scss">
@import '../../assets/styles';

.posts-wrapper {
  margin-top: 20px;
}

.posts-container {
  display: flex;
  border-bottom: solid 2px var(--vt-c-grey-light);
  height: auto;
  flex-wrap: wrap;
  padding: 2%;
  margin-left: 2em;

  flex-direction: column;
}

.posts-row-direction {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}

.posts-text-style {
  margin-top: 10px;
}

.posts-ava-more {
  margin-top: 2em;
}

.posts-ava-more.svg {
  align-items: flex-end;
  justify-content: flex-end;
}

.picsStyleSmallest.greyColor {
  color: var(--vt-c-grey-light);
  margin-left: 5em;
}

.actions {
  margin-top: 20px;

}

.comments {
  margin-top: 20px;
  margin-left: 3em;
}

</style>