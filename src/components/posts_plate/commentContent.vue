<script>
import {commonMethods} from "@/components/mixins/commonMethods.js";
import Avatar_display from "@/components/childComps/avatar_display.vue";
export default {
  name: "comments",
  components: {Avatar_display},
  mixins: [commonMethods],
  props: {
    commentContent: {
      type: Object,
      required: true
    }
  },
}
</script>

<template>
  <div class="posts-text-style">

      <div class="flex-center-row" v-if="commentContent.user">

        <avatar_display :user="{ avatar: commentContent.user.avatar, name: commentContent.user.username }" type="small"></avatar_display>

        <div class="flex-center-column">
        <h2 class="User-small-userName">{{ commentContent.user?.username || 'No avatar available'  }}</h2>
        <p class="User-small-description">{{ commentContent.user?.description || 'No description available' }}</p>
        </div>

        <p class="User-small-description">{{ commentContent.createdAt }}</p>

      </div>

      <p>{{ commentContent.content }}</p>

  </div>




</template>

<style scoped lang="scss">
@import '../../assets/styles';

.posts-text-style {
  padding-top: 15px;
  padding-bottom: 1em;
  display: flex;
  border-bottom: solid 1px var(--vt-c-grey-light);
  margin-left: 1em;
  flex-direction: column;
}
.flex-center-row {
  @include flex-center-row;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 25em;
  margin-bottom: 1em;
}
.User-small-description{
  margin:0;
  padding-top: 0.5em;
}

</style>