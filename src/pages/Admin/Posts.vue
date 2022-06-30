<template lang="pug">
  .admin-posts.inner-page.admin
    h2.admin__title Публикации
    .admin__wrap
      .inner-page__main
        .admin__search
          admin-search(v-model="search" @change-value="onChangeSearch")
        .admin-posts__list
          news-block(admin)
          news-block(admin blocked)
      .inner-page__aside
        admin-sidebar(v-model="filter" @change-filter="onChangeFilter")
</template>

<script>
import AdminSearch from '@/components/Admin/Search'
import AdminSidebar from '@/components/Admin/Sidebar'
import NewsBlock from '@/components/News/Block'
export default {
  name: 'AdminPosts',
  components: { AdminSidebar, AdminSearch, NewsBlock },
  data: () => ({
    filter: 'all',
    search: ''
  }),
  methods: {
    onChangeFilter(id) {
      this.filter = id
    },
    onChangeSearch(value) {
      this.search = value
    }
  }
}
</script>