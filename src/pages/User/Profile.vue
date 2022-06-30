<template lang="pug">
  .profile.inner-page(v-on:scroll="onScroll")
    .inner-page__main
      .profile__info
        profile-info(me online :info="getInfo")
      .profile__news(v-if="getWall.length >= 0")
        .profile__tabs
          span.profile__tab(@click="changeTab('POSTED')" :class="{active: activeTab === 'published'}") Мои публикации ({{getWallPostedLength}})
          span.profile__tab(@click="changeTab('QUEUED')" :class="{active: activeTab === 'queue'}" v-if="getWallQueuedLength > 0") Отложенные публикации ({{getWallQueuedLength}})
        .profile__add
          news-add
        .profile__news-list
          news-block(edit deleted :deffered="activeTab === 'queue'" v-for="news in activeWall"  :key="news.id" :info="news")
    .inner-page__aside
      friends-possible
</template>

<script>
import FriendsPossible from '@/components/Friends/Possible'
import ProfileInfo from '@/components/Profile/Info'
import NewsAdd from '@/components/News/Add'
import NewsBlock from '@/components/News/Block'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'Profile',
  components: { FriendsPossible, ProfileInfo, NewsAdd, NewsBlock },
  data: () => ({
    activeTab: 'POSTED',
    el: 20
  }),
  computed: {
    ...mapGetters('profile/info', ['getInfo']),
    ...mapGetters('users/info', ['getWall', 'getWallPostedLength', 'getWallQueuedLength']),
    activeWall() {
      return this.getWall.filter(el => el.type === this.activeTab)
    }
  },
  methods: {
    ...mapActions('users/info', ['apiWall', 'apiWallAdd']),
    ...mapActions('profile/feeds', ['apiFeeds', 'apiFeedsAdd']),
    changeTab(tab) {
      this.activeTab = tab
    },
    onScroll(element){
      var height =  document.documentElement.scrollHeight - document.documentElement.offsetHeight;
      var top  = window.pageYOffset
      if( top === height) {
          let a = this.el
          this.el = this.el + 20
         this.apiWallAdd({id: this.getInfo.id, offset: a, itemPerPage: '20'})
          console.log(this.el)
      }

    }
  },
  destroyed () {
      window.removeEventListener('scroll', this.onScroll);
  },
  created() {
    window.addEventListener('scroll', this.onScroll);
    if (this.getInfo) this.apiWall({ id: this.getInfo.id, offset: '0', itemPerPage: '20' })
  },
  
}
</script>
