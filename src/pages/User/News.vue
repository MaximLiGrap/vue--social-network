<template lang="pug">
  .news.inner-page
    .inner-page__main
      .news__add
        news-add(user)
      .news__list( v-if="getInfo" v-on:scroll="onScroll")
        news-block(
          v-for="feed in getFeeds" 
          :key="feed.id"
          :info="feed" 
          :edit="getInfo.id === feed.author.id" 
          :deleted="getInfo.id === feed.author.id"
        )
    .inner-page__aside
      friends-possible
 </template>

<script>
import { mapGetters, mapActions } from 'vuex'
import FriendsPossible from '@/components/Friends/Possible'
import NewsBlock from '@/components/News/Block'
import NewsAdd from '@/components/News/Add'
export default {
  data() {
    return {
      el: 20
    }
  },
  name: 'News',
  components: { FriendsPossible, NewsBlock, NewsAdd },
  computed: {
    ...mapGetters('profile/feeds', ['getFeeds', 'getTotal']),
    ...mapGetters('profile/info', ['getInfo']),
  },
  methods: {
    ...mapActions('profile/feeds', ['apiFeeds', 'apiFeedsAdd']),
    onScroll(element){
      var height =  document.documentElement.scrollHeight - document.documentElement.offsetHeight;
      var top  = window.pageYOffset
      if( top === height && this.getTotal >= this.el) {
          let a = this.el
          this.el = this.el + 20
          this.apiFeedsAdd({offset: a, perPage: '20'})
          console.log(this.el)
      }

    }
  },
  created () {
    window.addEventListener('scroll', this.onScroll);
  },
  destroyed () {
      window.removeEventListener('scroll', this.onScroll);
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.apiFeeds({offset: '0', perPage: '20'})
    })
  }
}
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl';

.news__add {
  margin-bottom: 30px;
}
strong {
  font-weight: bold;
}

em {
  font-style: italic;
}
</style>
