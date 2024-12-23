<script>
import {commonMethods} from "@/components/mixins/commonMethods.js";

export default {
  name: "commentsWriter",
  mixins: [commonMethods],
  computed: {
    isCommFilled() {   //btn design
      return this.textComm;
    }
  },
  data() {
    return {
      textComm: '',
      errorMessage: '',
    }
  },
  methods: {
    autoResize(event) {
      const textarea = event.target;
      textarea.style.height = "auto"; // Сбрасываем высоту перед изменением
      textarea.style.height = `${textarea.scrollHeight}px`; // Устанавливаем высоту в зависимости от содержимого
    },

    async publishPost() { //это добавление комментария
      if (this.isCommFilled) {
        const postId = this.$store.state.openCommentsPostId;
        const userId = this.$store.state.user.id;
        console.log('publishPost',userId);
        const content = this.textComm;
        try{
          await this.$store.dispatch('addComment', {postId, userId, content});
          await this.$store.dispatch('loadComments', postId);
          this.textComm = '';
          this.$notyf.success({
            message: 'Ваш комментарий опубликован!',
          });
        }catch(error){
          this.$store.dispatch('handleError', {message: 'Не удалось добавить ваш комментарий'});
        }
      }
    },
  },
}
</script>

<template>
  <div class="commentWriter-wrapper">
    <form @submit.prevent="publishPost" class="commentWriter-form">
      <textarea v-model="textComm" placeholder="Введите ваш комментарий" class="inputs inputComm"
                @input="autoResize"></textarea>
      <button class="btn btnComments" :class="{ 'btn': true, 'btnActive': isCommFilled }"
              :disabled="!isCommFilled">Отправить
      </button>
    </form>
    <p v-if="errorMessage" class="errorClass">{{ errorMessage }}</p>
  </div>
</template>

<style scoped lang="scss">
.commentWriter-wrapper {
  width: 100%;
  display: flex;
  margin-top: 2em;
  flex-direction: column;
}

.commentWriter-form {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.inputComm {
  width: 40em;
  height: auto;
  text-align: start;
  border: solid 2px var(--vt-c-grey-light);

  min-height: 50px; /* Минимальная высота */
  max-height: 200px; /* Максимальная высота */
  overflow-y: auto; /* Полоса прокрутки появляется при достижении max-height */
  resize: none; /* Отключить ручное изменение размера */
}

.inputComm::placeholder {
  color: #888;
  opacity: 0.7;
}

.btnComments {
  margin-left: 2em;
}

</style>