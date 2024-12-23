<script>
export default {
  name: "postContent",
  props: {
    content: {
      type: String,
      required: true
    }
  }
}
</script>

<template>
  <div class="posts-text-style">
    <p>{{ content }}</p>
  </div>
</template>

<style scoped lang="scss">
.posts-text-style {
  padding-top : 15px;
  padding-left: 6em;
}
</style>