<script>
import Avatar_display from "@/components/childComps/avatar_display.vue";
import TheLoadingPlashki from "@/components/loading/TheLoadingPlashki.vue";

export default {
  name: "subscribersContent",
  components: {TheLoadingPlashki, Avatar_display},
  props: {
    subscriptionContent: { //from subscribers
      type: Object,
      required: true // 'subscriptions' или 'subscribers'
    }
  },
}
</script>

<template>
    <div class="flex-center-row borderBase" v-if="subscriptionContent">

      <div class="row rowUser">
      <avatar_display :user="{ avatar: subscriptionContent.avatar, name: subscriptionContent.userName }"
                      type="small"></avatar_display>
      <div class="flex-center-column">
        <h2 class="User-small-userName">{{ subscriptionContent?.userName || 'No avatar available' }}</h2>
        <p class="User-small-description">{{ subscriptionContent?.description || 'No description available' }}</p>
      </div>
      </div>

      <div class="row">
        <p class="User-small-userName nums">{{ subscriptionContent?.subscribers.length }} </p>
        <p class="User-small-userName">
          Подписчики
        </p>
      </div>

      <div class="btn primary" @click="$emit('handleSubscription', this.subscriptionContent.id)">
        подписаться
      </div>
    </div>



</template>

<style scoped lang="scss">
@import '../../assets/styles';

.row{
  display: flex;
  flex-direction: row;
  max-width: 10%;
  flex: 1 1 auto;
  gap: var(--gap-small);
  margin-right: var(--margin-medium);
}
.rowUser{
  max-width: var(--small-width);
  margin-right: 0;
  flex: 1 1 auto;
}
.flex-center-row {
  @include flex-center-row;
  display: flex;
  justify-content: flex-start;
  gap: var(--gap-large);
  align-items: flex-start;
  flex-wrap: wrap;
  max-width: var(--medium-width);
  margin-bottom: var(--margin-medium);
  padding-bottom: var(--margin-medium);
}

.User-small-description {
  margin: 0;
  padding-top: var(--margin-small);
}
.nums {
  margin-left: 0;
}
</style>