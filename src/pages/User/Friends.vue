<template lang="pug">
  .friends.inner-page
    .inner-page__main
      .friends__header
        h2.friends__title Мои друзья
        .friends__search
          .friends__search-icon
            simple-svg(:filepath="'/static/img/search.svg'")
          input.friends__search-input(placeholder="Начните вводить имя друга..." v-model="first_name")
      .friends__list
        friends-block(friend v-for="friend in friends" :key="friend.id" :info="friend")
      .friends__header(v-if="requestFrend.length > 0")
        h2.friends__title Запросы в друзья
      .friends__list
        friends-request(friend v-for="friend in requestFrend" :key="friend.id" :info="friend")
    .inner-page__aside
      friends-possible
</template>

<script>
import store from '@/store'
import { mapGetters, mapActions } from 'vuex'
import FriendsPossible from '@/components/Friends/Possible'
import FriendsBlock from '@/components/Friends/Block'
import FriendsRequest from '@/components/Friends/Request'
export default {
  name: 'Friends',
  components: { FriendsPossible, FriendsBlock, FriendsRequest },
  data: () => ({
    first_name: '',
  }),
  computed: {
    ...mapGetters('profile/friends', ['getResultById']),
    friends() {
      return this.first_name.length === 0
        ? this.getResultById('friends')
        : this.getResultById('friends').filter(
            el => el.first_name.toLowerCase().indexOf(this.first_name.toLowerCase()) !== -1
          )
    },
    requestFrend() {
      return this.first_name.length === 0
        ? this.getResultById('requestFrends')
        : this.getResultById('requestFrends').filter(
            el => el.first_name.toLowerCase().indexOf(this.first_name.toLowerCase()) !== -1
          )
    }
  },
  methods: {
    ...mapActions('profile/friends', ['apiFriends', 'requestFrends'])
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.apiFriends();
      vm.requestFrends();
    })
  },
  // created() {
  //   this.requestFrends();
  // },
}
</script>
