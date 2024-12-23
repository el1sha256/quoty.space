<script>
import {mapState, mapActions} from 'vuex'
import {commonMethods} from "@/components/mixins/commonMethods.js";
import Picture_svg from "@/components/svg/picture_svg.vue";
import Photo_svg from "@/components/svg/photo_svg.vue";
import Gif_svg from "@/components/svg/gif_svg.vue";
import Hashtag_svg from "@/components/svg/hashtag_svg.vue";
import Location_svg from "@/components/svg/location_svg.vue";
import Avatar_display from "@/components/childComps/avatar_display.vue";

export default {
  name: "UserSmall",
  components: {Avatar_display, Location_svg, Hashtag_svg, Gif_svg, Photo_svg, Picture_svg},
  mixins: [commonMethods],
  mounted() { //при перезагрузке странички
    this.$gsap.fromTo(
        ".User-small-main",
        {
          x: -200,
          rotation: 0,
        },
        {
          x: 0,
          rotation: 360,
          duration: 3,
          ease: "power2.out",
        }
    );

    this.$nextTick(()=>{
      const elements = document.querySelectorAll(".actions.userSmall > *");
      const tl = this.$gsap.timeline();
      elements.forEach((element, index) => {
        tl.fromTo(
            element,
            { x: -200, opacity: 0 },
            { x: 0, opacity: 1, duration: 1, ease: "power2.out" },
            index * 0.5
        );
      });
    });
  },
  computed: {
    ...mapState(['user', 'userName', 'description', 'avatar']),

  },
  data() {
    return {
      isImageLoaded: true, // По умолчанию считаем, что изображение загрузится
    };
  },
  methods: {
    toShortenDescr(description){
      console.log('1',description);
      if(this.user && description){
        console.log('2',description);
        return this.shortenDescription(description);
      }else{
        return '';
      }
    },
    openWriter(){
      this.$emit('openWriter');
    }
  },

}
</script>

<template>
  <div class="user-small-container">

    <div class="User-small-main">

      <avatar_display :user="{ avatar: user.avatar, name: user.userName }" type="normal"></avatar_display> <!--//отображение аватарки-->

    </div>

    <div class="User-small-main-text">
      <router-link to="/editing" class="linksText">
        <h2 class="User-small-userName">{{ user ? user.userName : 'Loading...' }}</h2>
        <p class="User-small-description"> {{ toShortenDescr(user.description) }} </p>
      </router-link>
    </div>

  </div>

  <div class="actions userSmall" data-aos="zoom-in">
    <picture_svg @click="openWriter"/>
    <photo_svg/>
    <gif_svg/>
    <hashtag_svg/>
    <location_svg/>
  </div>
</template>

<style lang="scss">
@import '../../assets/styles';

.user-small-container {
  border-bottom: solid 2px var(--vt-c-grey-light);
  height: 10em;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.User-small-main {
  @include flex-center-row;
  justify-content: flex-start;
}

.User-small-main-text {
  @include flex-center-column;
  margin-left: 2em;
}

.User-small-userName {
  font-weight: bold;
}

.User-small-description {
  color: var(--vt-c-grey-light);
}

</style>