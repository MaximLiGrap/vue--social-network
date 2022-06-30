<template lang="pug">
  .search-users
    search-block(title="Люди", id="users")
      .friends__list
        friends-block(v-for="user in users" :key="user.id" :info="user")
</template>

<script>
import { mapGetters } from 'vuex'
import SearchBlock from '@/components/Search/Block'
import FriendsBlock from '@/components/Friends/Block'
export default {
  name: 'SearchUsers',
  components: { SearchBlock, FriendsBlock },
  computed: {
    ...mapGetters('global/search', ['getResultById']),
    users() {
      return this.getResultById('users')
    }
  }
}
</script>
