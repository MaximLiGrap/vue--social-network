<template lang="pug">
  .page-push.inner-page
    .inner-page__main(v-if="getNotificationsLength > 0")
      push-block(v-for="info in filterNotifications" :key="info.id" :info="info")
    .inner-page__aside
      push-sidebar(v-model="activeFilter" @change-push-sidebar="onChangeFilter")
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import PushSidebar from '@/components/Push/Sidebar'
import PushBlock from '@/components/Push/Block'
export default {
  name: 'PagePush',
  components: { PushSidebar, PushBlock },
  data: () => ({
    activeFilter: 'Все',
    query: 'All',
    notification: [],
  }),
  computed: {
    ...mapGetters('profile/notifications', ['getNotifications', 'getNotificationsLength']),
    filterNotifications() {
      switch (this.activeFilter) {
        case 'Все':
          return this.getNotifications
        case 'Комментарии':
          return this.getNotifications.filter(
            el => el.event_type === 'POST_COMMENT' || el.event_type === 'COMMENT_COMMENT'
          )
        case 'Друзья':
          return this.getNotifications.filter(el => el.event_type === 'FRIEND_REQUEST')
      }
    },
  },
  methods: {
    ...mapActions('profile/notifications', ['apiNotifications', 'readNotifications']),
    onChangeFilter(item) {
      this.activeFilter = item
    },
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.apiNotifications()
      // vm.readNotifications()
    })
  },
  beforeRouteLeave(to, from, next) {
    this.readNotifications()
    next()
 
  },
  watch: {
    '$route.params.name': {
      handler() {
        switch (this.$route.query.name) {
          case 'POST':
            return this.activeFilter = 'Все'
          case 'POST_COMMENT':
            return this.activeFilter = 'Комментарии'
            case 'COMMENT_COMMENT':
            return this.activeFilter = 'Комментарии'
          case 'FRIEND_REQUEST':
            return this.activeFilter = 'Друзья'
        }    
      },
      immediate: true,
    },
  },
}
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl';

.page-push {
  @media (max-width: breakpoint-xl) {
    flex-direction: column;

    .inner-page__aside {
      display: block;
      max-width: 100%;
      order: -1;

      .aside-filter__item {
        text-align: center;
      }
    }

    .inner-page__main {
      margin-right: 0;
    }
  }
}
</style>
