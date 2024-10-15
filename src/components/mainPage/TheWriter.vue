<script>
export default {
  name: "TheWriter"
}
</script>

<template>
  <div class="">

  </div>
  <form @submit.prevent="publishPost">
    <textarea v-model="newPostContent" placeholder="Напишите что-то..."></textarea>
    <button type="submit">Опубликовать</button>
  </form>
</template>

<style scoped lang="scss">

</style>