<script>
import {commonMethods} from "@/components/mixins/commonMethods.js";

export default {
  name: "avatar_display",
  mixins: [commonMethods],
  props: {
    user: { //ожидает 2 моментa :user="{ name: 'John', avatar: 30 }"
      type: Object,
      required: true
    },
    type:{ //какой класс будет применен k аватару
      type: String,
    }
  },
  computed:{
    dynamicClass() {
      if (this.type === 'small') {
        return 'avatar-small';
      } else if (this.type === 'normal') {
        return 'avatar';
      } else {
        return 'avatar-big';
      }
    },
  },
  data() {
    return {
      isImageLoaded: true, // По умолчанию считаем, что изображение загрузится
    };
  },
  methods: {
    onImageError(event) {
      this.handleImageError(event); //mixins
      this.isImageLoaded = false;
    }
  },
}
</script>

<template>
  <img v-if="user?.avatar && isImageLoaded " @error="onImageError" :src="user?.avatar" alt="U"
       :class="dynamicClass"/>
  <div v-else :class="dynamicClass">{{ user?.name.charAt(0).toUpperCase() || '?' }}</div>
</template>

<style scoped lang="scss">

</style>