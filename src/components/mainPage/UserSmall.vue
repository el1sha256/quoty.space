<script>
import {computed} from 'vue'
import {mapState, mapActions} from 'vuex'

export default {
  name: "UserSmall",
  /*inject: ['users'],*/
  computed: {
    ...mapState(['user']),
  },
  methods: {
    ...mapActions([ 'restoreUser']),
  },

}
</script>

<template>
  <div class="user-small-container">

    <div class="User-small-main">
      <!--    //тyт будет компонент с юзернеймом и аватаркой-->
      <div class="avatar"></div>

      <div class="User-small-main-text">
        <router-link to="/editing" class="linksText">
          <h2>{{ user ? user.email : 'Loading...' }}</h2>
          <p>{{ user ? user.bio : '' }}</p>
          <p>{{ user ? user.token : '' }}</p>
        </router-link>
      </div>

<!--      <button class="btn danger" @click.prevent="this.logout(this.$router)">
        Выйти
      </button>-->

    </div>

    <div class="actions">
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" class="picsStyleSmallest">
        <g fill="none">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M20.33 17.657c.11-.366.17-.755.17-1.157v-9a4 4 0 0 0-4-4h-9a4 4 0 0 0-4 4v9.07m16.83 1.087l-.088-.104l-2.466-2.976a2 2 0 0 0-3.073-.008l-1.312 1.566l-.214.261m7.153 1.26a4 4 0 0 1-3.713 2.842m0 0l-.117.002h-9a4 4 0 0 1-4-3.93m13.117 3.928l-.093-.106l-3.347-3.996m-9.676.175l.177-.201l3.206-3.827a2 2 0 0 1 3.066 0l3.227 3.853"/>
          <circle cx="15.091" cy="8.909" r="1.5" fill="currentColor"/>
        </g>
      </svg>

      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20" class="picsStyleSmallest">
        <g fill="currentColor" fill-rule="evenodd" clip-rule="evenodd">
          <path
              d="M6.172 5.232L5.762 6.5H4.5A2.5 2.5 0 0 0 2 9v6a2.5 2.5 0 0 0 2.5 2.5h11A2.5 2.5 0 0 0 18 15V9a2.5 2.5 0 0 0-2.5-2.5h-1.263l-.409-1.268a2.5 2.5 0 0 0-2.38-1.732H8.552a2.5 2.5 0 0 0-2.38 1.732M4.5 7.5h1.99l.633-1.96A1.5 1.5 0 0 1 8.551 4.5h2.898a1.5 1.5 0 0 1 1.427 1.04l.633 1.96H15.5A1.5 1.5 0 0 1 17 9v6a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 3 15V9a1.5 1.5 0 0 1 1.5-1.5"/>
          <path d="M7 11.5a3 3 0 1 0 6 0a3 3 0 0 0-6 0m5 0a2 2 0 1 1-4 0a2 2 0 0 1 4 0"/>
        </g>
      </svg>

      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" class="picsStyleSmallest">
        <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
           color="currentColor">
          <path
              d="M7.504 17c-.035-.766-.393-.966-1.498-1H4.507a1 1 0 0 0-.999 1v2.894c0 .736-.137 1.727.544 2.004c.122.05.27.082.455.102h2.398a.6.6 0 0 0 .6-.6v-1.5a.4.4 0 0 0-.4-.4h-1.1m4.496-3.5h3.496m-3.496 6h1.748m0 0h1.748m-1.748 0v-5.86M16.994 22v-5.4a.6.6 0 0 1 .6-.6h2.896m-3.496 3h2.497M3.508 13v-.804c0-2.967 0-4.45.469-5.636c.753-1.905 2.347-3.407 4.367-4.118C9.601 2 11.174 2 14.322 2c1.798 0 2.697 0 3.415.253c1.155.406 2.065 1.264 2.496 2.353c.268.677.268 1.525.268 3.22V13"/>
          <path
              d="M3.508 12A3.333 3.333 0 0 1 6.84 8.667c.665 0 1.45.116 2.097-.057a1.67 1.67 0 0 0 1.178-1.179c.173-.647.057-1.432.057-2.098A3.333 3.333 0 0 1 13.504 2"/>
        </g>
      </svg>

      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" class="picsStyleSmallest">
        <g fill="none" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M11 7L8 17m8-10l-3 10m5-7H7m10 4H6"/>
          <path
              d="M2 12c0-4.714 0-7.071 1.464-8.536C4.93 2 7.286 2 12 2s7.071 0 8.535 1.464C22 4.93 22 7.286 22 12s0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12Z"/>
        </g>
      </svg>

      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" class="picsStyleSmallest">
        <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
          <path
              d="M12.56 20.82a.96.96 0 0 1-1.12 0C6.611 17.378 1.486 10.298 6.667 5.182A7.6 7.6 0 0 1 12 3c2 0 3.919.785 5.333 2.181c5.181 5.116.056 12.196-4.773 15.64"/>
          <path d="M12 12a2 2 0 1 0 0-4a2 2 0 0 0 0 4"/>
        </g>
      </svg>

    </div>
  </div>
</template>

<style lang="scss">
@import '../../assets/styles';

.user-small-container {
  border-bottom: solid 2px var(--vt-c-grey-light);
  height: 10em;
  /*background-color: #2c3e50;*/
}

.User-small-main {
  @include flex-center-row;
  justify-content: flex-start;
}

.User-small-main-text {
  @include flex-center-column;
  margin-left: 2em;
}


</style>