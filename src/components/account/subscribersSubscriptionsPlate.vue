<script>
import ArrowBack_svg from "@/components/svg/arrowBack_svg.vue";
import commentContent from "@/components/posts_plate/commentContent.vue";
import SubscribersContent from "@/components/account/subscribersSubscriptionsContent.vue";
import {mapActions, mapState} from "vuex";
import TheLoadingPlashki from "@/components/loading/TheLoadingPlashki.vue";

export default {
  name: "subscribers",
  components: {SubscribersContent, commentContent, ArrowBack_svg, TheLoadingPlashki},
  created() {
    console.log('this workedSubscribersss', this.$route.query.userId); // ID пользователя
    this.currentUserId = this.$route.query.userId;
    this.currentType = this.$route.path.split('/').pop(); // Получает 'subscribers' или 'subscriptions'
    this.loadSubscriptionsSubscribers();
  },
  computed: {
    is_loading() {
      return this.$store.state.isLoading.subscriptions;
    },
    ...mapState({
      isGlobalLoading: state => state.isLoading.global,
    }),
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },

  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    ...mapActions(['fetchSubscriptionsSubscribers']),
    goBack() {
      this.$router.go(-1);
    },

    async loadSubscriptionsSubscribers() { //подписки
      if (this.isLoading || !this.hasMore) return;

      this.$store.commit('setLoadingState', { key: 'subscriptions', value: true });

      const response = await this.fetchSubscriptionsSubscribers({
        userId: this.currentUserId,
        type: this.currentType,
        page: this.currentPage,
        limit: this.limit,
      });

      const newItems = response?.items || []; // Используем `items`, возвращенные API
      console.log('newItems1',newItems); //
      if (this.currentType === 'subscriptions') {
        const uniqueItems = newItems.filter(
            (item) => !this.subscriptions.some((sub) => sub.id === item.id)
        );
        this.subscriptions = [...this.subscriptions, ...uniqueItems];
        console.log('subscriptions1',this.subscriptions);
        console.log('newItems2length', newItems.length); //1

      } else if (this.currentType === 'subscribers') {
        const uniqueItems = newItems.filter(
            (item) => !this.subscribers.some((sub) => sub.id === item.id)
        );
        this.subscribers = [...this.subscribers, ...uniqueItems];
        console.log('Loaded Subscribers: loadSubscribers', this.subscribers); //

      }
      this.hasMore = response.hasNextPage; //nw
      if (response.hasNextPage) {
        this.currentPage += 1; // Переходим к следующей странице
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log('Current Page:', this.currentPage);//2 //возрастают в геометрической прогрессии
      console.log('Loaded Items:', newItems);
      console.log('hasNextPage', this.hasMore); //nw //true and true

      this.$store.commit('setLoadingState', { key: 'subscriptions', value: false });
    },


    handleScroll() {
      if (
          window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10
      ) {
        this.loadSubscriptionsSubscribers(); // Загружаем следующую страницу
      }
    },


    async handleSubscription(subscriptionId) { //make it
      //surrender Id of people whom I want to subscribe
    }

  },
  data() {
    return {
      currentUserId: null,
      currentType: null,
      subscriptions: [],
      subscribers: [],
      currentPage: 1,
      limit: 2,
      hasMore:true, // можно ли загрузить больше
    }
  },
}
</script>

<template>
  <div  class="login-wrapper" v-if="!isGlobalLoading">
    <arrow-back_svg class="svg-header danger" @click="goBack"/>

    <div data-aos="fade-up" v-for="subscription in subscriptions" :key="subscription.id" class="row" v-if="currentType==='subscriptions'">
      <subscribers-content :subscriptionContent="subscription"/>
    </div>

    <div data-aos="fade-up" v-for="subscriber in subscribers" :key="subscriber.id" class="row" v-if="currentType==='subscribers'">
      <subscribers-content :subscriptionContent="subscriber"/>
    </div>

    <TheLoadingPlashki class="loading" :isLoading="is_loading" :num-of-things="2" type="column"/> <!--//v-if="is_loading" уже в самом компоненте-->
    <!-- Сообщение, если больше нет данных -->
    <div v-if="!hasMore && !is_loading" class="end-message">
      Больше нет данных.
    </div>

  </div>

</template>

<style scoped lang="scss">
.login-wrapper {
  color: var(--vt-c-black);
  min-width: var(--min-width-medium);
  flex-wrap: wrap;
}
.loading{
  width: 50em;

}

</style>