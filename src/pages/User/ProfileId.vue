<template lang="pug">
  .profile.inner-page(v-if="getUsersInfo")
    .inner-page__main
      .profile__info
        profile-info(:info="getUsersInfo" :blocked="getUsersInfo.is_blocked" :friend="getUsersInfo.is_friend" :online="getUsersInfo.is_onlined")
      .profile__news
        .profile__tabs
          span.profile__tab.active Публикации {{getUsersInfo.first_name}} ({{getWall.length}})
        .profile__news-list
          news-block(v-for="news in getWall" :key="news.id" :info="news")
    .inner-page__aside
      friends-possible
</template>

<script>
import FriendsPossible from '@/components/Friends/Possible'
import ProfileInfo from '@/components/Profile/Info'
import NewsBlock from '@/components/News/Block'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'ProfileId',
  components: { FriendsPossible, ProfileInfo, NewsBlock },
  data: () => ({
    loading: false,
    el: 20
  }),
  computed: {
    ...mapGetters('users/info', ['getUsersInfo', 'getWall'])
  },
  methods: {
    ...mapActions('users/info', ['userInfoId', 'apiWallAdd']),
    onScroll(element){
      var height =  document.documentElement.scrollHeight - document.documentElement.offsetHeight;
      var top  = window.pageYOffset
      if( top === height) {
          let a = this.el
          this.el = this.el + 20
         this.apiWallAdd({id: this.$route.params.id, offset: a, itemPerPage: '20'})
          console.log(this.el)
      }

    }
  },
  destroyed () {
      window.removeEventListener('scroll', this.onScroll);
  },
  created() {
    this.userInfoId(this.$route.params.id);
    window.addEventListener('scroll', this.onScroll);
    if (this.getInfo) this.apiWall({ id: this.$route.params.id, offset: '0', itemPerPage: '20' })
  },
  watch: {
    '$route.params.id': {
      handler() {   
        this.userInfoId(this.$route.params.id)
      },
      immediate: true,
    },
  },
}
</script>
