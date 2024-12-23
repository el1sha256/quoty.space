<script>
import {mapActions, mapGetters, mapState} from "vuex";
import Avatar_display from "@/components/childComps/avatar_display.vue";
import ArrowBack_svg from "@/components/svg/arrowBack_svg.vue";

export default {
  name: "accountInfo",
  components: {ArrowBack_svg, Avatar_display},
  computed: {
    ...mapState(['user', 'userName', 'description', 'avatar']),
    ...mapState({
      isGlobalLoading: state => state.isLoading.global,
    }),
  },
  mounted() {
    this.currentUserId = this.$route.query.userId;
    this.loadUserInfo(); // Загрузка данных о пользователе
  },
  data() {
    return {
      currentUserId: null,
      currentUser: null,
    }
  },
  methods: {
    ...mapActions(['fetchUser']),

    async loadUserInfo() {
      try {
        if (this.currentUserId) { //2
          this.currentUser = await this.fetchUser(this.currentUserId);
          console.log('loadUserInfo()', this.currentUser);
        }
      } catch (error) {
        const errorMessage = error.message || 'Ошибка при загрузке пользователя';
        this.$store.dispatch('handleError', {type: 'normal', message: errorMessage});
      }
    },
    goBack() {
      this.$router.go(-1);
    },
    //subscribers or subscriptions
    goToSubscribersSubscriptions(type) {
      this.$router.push({
        path: `/information/${type}`,
        query: {userId: this.currentUserId},
      });
    },
  },

}
</script>

<template>
  <div v-if="!$route.path.includes('subscribers') && !$route.path.includes('subscriptions')">
    <div class="login-wrapper userInfo-wrapper" v-if="currentUser && !isGlobalLoading">
      <arrow-back_svg class="svg-header danger" @click="goBack"/>
      <div class="flex-center-row">
        <avatar_display :user="{ avatar: currentUser.avatar, name: currentUser.userName }"
                        type="normal"></avatar_display>
        <div class="linksText">
          <div class="User-small-main-text ">
            <h2 class="User-small-userName">{{ currentUser.userName }}</h2>
            <p class="User-small-description">{{ currentUser.description }}</p>
          </div>
        </div>
        <div class="subscribers-wrapper" @click="goToSubscribersSubscriptions('subscriptions')"> <!--//подписки-->
          <p class="baseTextBold">
            {{ currentUser?.subscriptions?.length || 0 }}
          </p>
          <p class="User-small-description">
            Подписки
          </p>
        </div>

        <div class="subscribers-wrapper" @click="goToSubscribersSubscriptions('subscribers')">
          <p class="baseTextBold">
            {{ currentUser?.subscribers?.length || 0 }}
          </p>
          <p class="User-small-description">
            Подписчики
          </p>
        </div>

        <div class="subscribers-wrapper">
          <p class="baseTextBold">
            {{ currentUser?.receivedLikes || 0 }}
          </p>
          <p class="User-small-description">
            Лайки
          </p>
        </div>
      </div>
    </div>
  </div>

  <router-view/>

</template>

<style scoped lang="scss">
@import '../../assets/styles';

.flex-center-row {
  @include flex-center-row;
  align-items: center;
  gap: 1em;
}

.greyColor {
  color: var(--vt-c-grey-light);
}

.subscribers-wrapper {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
  line-height: 1;
  margin-left: 1em;
  cursor: pointer;
}

.baseTextBold {
  margin: 0;
}

</style>