<template lang="pug">
  .admin-moderators.inner-page.admin
    h2.admin__title Администраторы и модераторы
    .admin__wrap
      .inner-page__main
        a.admin-moderators__link(href="#") Добавить
        friends-block(moderator)
        friends-block(moderator)
      .inner-page__aside
        admin-sidebar(v-model="filter" :list="list" @change-filter="onChangeFilter")
</template>

<script>
import AdminSearch from '@/components/Admin/Search'
import AdminSidebar from '@/components/Admin/Sidebar'
import FriendsBlock from '@/components/Friends/Block'
export default {
  name: 'AdminModerators',
  components: { AdminSidebar, AdminSearch, FriendsBlock },
  data: () => ({
    filter: 'all',
    list: [
      { text: 'Все', id: 'all' },
      { text: 'Модераторы', id: 'moderators' },
      { text: 'Администраторы', id: 'admins' }
    ]
  }),
  methods: {
    onChangeFilter(id) {
      this.filter = id
    }
  }
}
</script>


<style lang="stylus">
@import '../../assets/stylus/base/vars.styl';

.admin-moderators {
  .inner-page__main {
    position: relative;
  }
}

.admin-moderators__link {
  font-size: 13px;
  color: #21A45D;
  position: absolute;
  right: 15px;
  top: -40px;
}
</style>
