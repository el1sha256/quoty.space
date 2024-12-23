<script>
export default {
  name: "TheLoadingPlashki",
  props:{
    isLoading: {
      type: Boolean,
      required: true,
    },
    numOfThings:{
      type: Number,
    },
    type:{
      type: String,
    }
  },
}
</script>

<template>
<!--   Заглушки для комментариев, пока они загружаются -->
      <div v-if="isLoading && type ==='column'">
        <div v-for="n in numOfThings" :key="n" class="comment-placeholder">
          <div class="avatar-small"></div>
          <div class="text-placeholder"></div>
        </div>
      </div>
  <div v-if="isLoading && type ==='row'">
    <div v-for="n in numOfThings" :key="n" class="comment-placeholder-row">
      <div class="text-placeholder"></div>
    </div>
  </div>
</template>

<style lang="scss">
.comment-placeholder {
  width: var(--loadingPlashki-width);
  margin-left: 1em;
  margin-bottom: 1em;
  display: flex;
  align-items: center;
  gap: 30px;
  background-color: #f0f0f0;
  padding: 1em;
  border-radius: 8px;
  animation: pulse 1.5s infinite ease-in-out;
}

.text-placeholder {
  flex: 1;
  height: 30px;
  background: #e0e0e0;
  border-radius: 4px;
}

@keyframes pulse {
  0% {
    background-color: #f0f0f0;
  }
  50% {
    background-color: #e0e0e0;
  }
  100% {
    background-color: #f0f0f0;
  }
}

.comment-placeholder-row {
  flex-direction: row;
  width: 80%;
  margin-left: 1em;
  margin-bottom: 1em;
  display: flex;
  align-items: center;
  gap: 30px;
  background-color: #f0f0f0;
  padding: 1em;
  border-radius: 8px;
  animation: pulse 1.5s infinite ease-in-out;
}
</style>