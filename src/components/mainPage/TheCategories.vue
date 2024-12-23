<script>
import {mapActions, mapState} from "vuex";
import dragScrollMixin from "@/components/mixins/dragScrollMixin.js";

export default {
  name: "TheCategories",
  mixins: [dragScrollMixin],

  mounted() { //при перезагрузке странички
    this.$store.dispatch('fetchCategories');
  },

  computed: {
    ...mapState(['allCategories','selectedCategory']),
  },
  watch: {
    // Наблюдаем за изменением параметра
    selectedCategory: {
      immediate: true,
      handler() {
        this.selectedCategorySt = this.selectedCategory;
      },
    },
  },

  data() {
    return {
      selectedCategorySt: '', //for dynamic styles
    }
  },
  methods:{
    changeCategory(category){
      if (category) {
        this.$router.push({ name: 'mainPageWithSlug', params: { category } }); // Изменяем маршрут без перезагрузки
        this.selectedCategorySt = category; //for dynamic styles
      } else {
        this.$router.replace('/mainPage'); // Если категории нет, возвращаемся к общим постам
      }
    }
  },
}
</script>

<template>
  <div class="scroll-container" ref="scrollContainer"
       @mousedown="startDrag"
       @mousemove="dragScroll"
       @mouseup="stopDrag"
       @mouseleave="stopDrag"
       @touchstart="startDrag"
       @touchmove="dragScroll"
       @touchend="stopDrag"
       @scroll="onScroll"
  >
    <div v-for="category in allCategories" :key="category.id" class="categoryStyle baseTextBold" @click="changeCategory(category.name)"
    :class="{'activeCategory': selectedCategorySt === category.name}"
    >

        {{ category.name }}

    </div>
  </div>
</template>

<style scoped lang="scss">
@import '../../assets/styles';



.scroll-container {
  @include flex-center-row;
  @include scroll-container;
}

.categoryStyle {
  background-color: var(--vt-c-grey-light);
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 200px; /* Минимальная ширина карточки */
  height: 70px;
  flex-shrink: 0; /* Элементы не сжимаются */
  cursor: pointer;
}
.activeCategory{
  filter: drop-shadow(0 0 5px var(--vt-c-accent-color));
}

</style>