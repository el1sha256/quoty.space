<script>
export default {
  name: "main_error",
  props:{
    errorMsg: { //contains heading and text
      type: String,
      required: true
    },
  },
  data(){
    return {
      modal: false,
    }
  },
  methods:{
    closeErrorModal(){
      this.modal = true;
      this.$store.dispatch('clearError', 'normal')
    },
  },
}
</script>

<template>

  <div v-if="!modal" class="modal-backdrop" @click="closeErrorModal"></div>
  <div class="app-modalWrap">
    <div class="baseTextBold"> {{ errorMsg.heading }} </div>


    <p class="baseText">{{ errorMsg.text }} </p>
  </div>

</template>

<style scoped lang="scss">
.app-modalWrap {
  position: relative;
  background-color: var(--vt-c-white-soft);
  border: 3px solid var(--vt-c-red-color);
  padding: 50px;
  border-radius: 8px;
  z-index: 9999;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.4);
  color:black;
}
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 999;
}
.baseTextBold{
  border-bottom: solid 2px var(--vt-c-red-color);
  margin-bottom: 5%;
}
</style>