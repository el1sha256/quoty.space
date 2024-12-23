<script>
import {mapState} from "vuex";
import Main_error from "@/components/errors/main_error.vue";
import {commonMethods} from "@/components/mixins/commonMethods.js";
import Small_error from "@/components/errors/small_error.vue";

export default {
  name: "TheWriter",
  components: {Small_error, Main_error},
  mixins: [commonMethods],
  computed: {
    ...mapState(['allCategories','selectedCategory','error']),
  },
  watch: {
    // Наблюдаем за изменением параметра
    selectedCategory: {
      immediate: true,
      handler() {
        this.postContent.category = this.selectedCategory;
      },
    },
    postText:{
      immediate: true,
    handler() {
      return this.postContent.postText.trim() !== '' && this.postContent.category !== '';
    }
    }
  },

  data() {
    return {
      errorMessage: '',
      postContent:{
        postText: '',
        category: this.selectedCategory,
      },
    }
  },
  methods: {
    publishPost() {
      const isPostTextValid = this.validatePostMixin(this.postContent.postText);

      if (isPostTextValid) {
        const userId = this.$store.state.user.id;
        console.log('publishPost', userId);
        const postContent = this.postContent;
        this.$store.dispatch('addPost', {userId, postContent});
        console.log('publishPost2', postContent);
        this.postContent.postText = '';
        this.$notyf.success({
          message: 'Ваш пост опубликован!',
        });
      }
    },
  }
}
</script>

<template>
  <div class="theWriter-wrapper">

<p class="bigText">Новый пост</p>

    <form @submit.prevent class="commentWriter-form">

      <select id="category" v-model="postContent.category" required >
        <option value="" disabled>Select a category</option>
        <option v-for="category in allCategories" :key="category.id" :value="category.name">
          {{ category.name }}
        </option>
      </select>

      <textarea v-model="postContent.postText" placeholder="Напишите что-то..." class="inputs inputComm"></textarea>
      <small_error v-if="error.small" :errorMsg="error.small"/>
      <button class="btn btnComments" :class="{ 'btn': true, 'btnActive': postContent.postText }" @click="publishPost">Отправить
      </button>
    </form>

    <main_error v-if="error.normal" :errorMsg="error.normal"/> <!--обычная ошибка-->

  </div>
</template>

<style scoped lang="scss">

.theWriter-wrapper{
  display: flex;
  flex-wrap: wrap;
  margin-top: 2em;
  flex-direction: column;
  border: solid 2px var(--vt-c-grey-light);
  padding: 2em;
}

.commentWriter-form {
  display: flex;
  align-items: flex-start;
  flex-direction:column;
  gap: 30px;
}

.inputComm {
  width: 40em;
  height: auto;
  text-align: start;
  border: solid 2px var(--vt-c-grey-light);
  min-height: 50px;
  max-height: 200px;
  overflow-y: auto;
  resize: none;
}

.inputComm::placeholder {
  color: #888;
  opacity: 0.7;
}

.btnComments {
  margin-left: 2em;
}
</style>