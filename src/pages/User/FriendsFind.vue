<template lang="pug">
  .friends.friends-find.inner-page
    .inner-page__main
      .friends__header
        h2.friends__title
          template(v-if="searchUsers.length === 0") Возможные друзья
          template(v-else) Найдено {{searchUsers.length}} человек
      .friends__list(v-if="searchUsers.length > 0")
        friends-block(v-for="user in searchUsers" :key="user.id" :info="user")
      .friends__list(v-else-if="possibleFriends")
        friends-block(v-for="user in possibleFriends" :key="user.id" :info="user")
    .inner-page__aside
      friends-search
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import FriendsBlock from '@/components/Friends/Block'
import FriendsSearch from '@/components/Friends/Search'
export default {
  name: 'FriendsFind',
  components: { FriendsBlock, FriendsSearch },
  data: () => ({
    isPossible: true,
    friends: []
  }),
  computed: {
    ...mapGetters('profile/friends', ['getResultById']),
    possibleFriends() {
      return this.getResultById('recommendations')
    },
    searchUsers() {
      return this.$store.getters['global/search/getResultById']('users')
    }
  },
  methods: {
    ...mapActions('profile/friends', ['apiAddFriends', 'apiRecommendations'])
  },
  mounted() {
    if (this.possibleFriends.length === 0) this.apiRecommendations()
  }
}
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl';

.friends-find {
  @media (max-width: breakpoint-xl) {
    &.inner-page {
      flex-direction: column;
    }

    .inner-page__aside {
      display: block;
      max-width: 100%;
      order: 0;
      margin-bottom: 20px;
    }

    .inner-page__main {
      margin-right: 0;
      order: 1;
    }
  }
}
</style>
