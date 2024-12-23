<script>
export default {
  name: "TheMainLoader",
  props:{
    isLoading: {
      type: Boolean,
    },
    message:{
      type: String,
  }
  }
}
</script>

<template>
  <div class="dots-loader" v-if="isLoading">
    <span></span>
    <span></span>
    <span></span>
    <p>{{message}}</p>
  </div>
</template>

<style scoped lang="scss">
.dots-loader {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.dots-loader span {
  width: 8px;
  height: 8px;
  margin: 0 4px;
  background-color: #3498db;
  border-radius: 50%;
  animation: dots 1.5s infinite ease-in-out;
}

.dots-loader span:nth-child(1) {
  animation-delay: 0s;
}
.dots-loader span:nth-child(2) {
  animation-delay: 0.2s;
}
.dots-loader span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes dots {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}
</style>