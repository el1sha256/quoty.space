<script>
import Actions from "@/components/childComps/actions.vue";

export default {
  name: "UserText",
  components: {Actions},
  inject: ['users']
}
</script>

<template>
  <div class="the-text-container">

    <div class="User-small-main">
      <!--    //тyт будет компонент с юзернеймом и аватаркой-->
      <div class="avatar"></div>
      <div class="User-small-main-text">
        <h2> users.username</h2>
        <p> users.bio</p>
      </div>


    </div>

    <div class="writer">
      <p class="baseText"> fdwfvaeiuwheiruhcndsjoiofejrhfiuehfjkwanscjvnbfreihfeiruwhjvijcfedjj</p>
    </div>

    <actions></actions>
  </div>

</template>

<style scoped lang="scss">
.the-text-container {
  width: 100%;
  margin-top: 3em;
  padding: 0 0 1em 3em ;
  height: auto;
  border-bottom: solid 2px var(--vt-c-grey-light);
}
.writer{
  padding-left: 6em;
  margin-top: 1em;
}
</style>