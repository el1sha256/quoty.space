<script>
export default {
  name: "small_error",
  props:{
    errorMsg: { //contains heading and text
      type: String,
      required: true
    },
  },
}
</script>

<template>
  <p class="errorClass">{{ errorMsg }}</p>
</template>

<style scoped lang="scss">

</style>