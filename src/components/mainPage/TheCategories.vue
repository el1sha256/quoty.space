<script>
export default {
  name: "TheCategories",
  inject: ['categories'],
  data() {
    return {}
  }
}
</script>

<template>
  <div class="the-categories-container">
    <div v-for="category in categories" :key="category.id" class="categoryStyle baseTextBold">
      {{ category.name }}
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '../../assets/styles';

.the-categories-container {
  @include flex-center-row;

  justify-content: space-evenly;
  height: 6em;
  margin-top: 2em;
  margin-bottom: 1em;
  border-bottom: solid 2px var(--vt-c-grey-light);

}

.categoryStyle {
  width: 15%;
  height: 60%;
  background-color: var(--vt-c-grey-light);
  border-radius: 15px;
 /* font-size: var(--font-size-medium);*/
  display: flex;
  justify-content: center;
  align-items: center;
  /*  border: 1px solid var(--vt-c-grey-light);*/
}
</style>