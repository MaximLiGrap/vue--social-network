<template lang="pug">
  .admin-users.inner-page.admin
    h2.admin__title Люди
    .admin__wrap
      .inner-page__main
        .admin__search
          admin-search(v-model="search" @change-value="onChangeSearch")
        .friends__list
          friends-block(admin)
          friends-block(admin blocked)
      .inner-page__aside
        admin-sidebar(v-model="filter" @change-filter="onChangeFilter")
</template>

<script>
import AdminSearch from '@/components/Admin/Search'
import AdminSidebar from '@/components/Admin/Sidebar'
import FriendsBlock from '@/components/Friends/Block'
export default {
  name: 'AdminUsers',
  components: { AdminSidebar, AdminSearch, FriendsBlock },
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