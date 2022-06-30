<template lang="pug">
  .aside-filter
    h2.aside-filter__title Оповещения
    ul.aside-filter__list
      li.aside-filter__item(v-for="item in list" :key="item" :class="{active: item === value}" @click="changePushSidebar(item)") {{item}}
</template>

<script>
export default {
  name: 'PushSidebar',
  props: {
    value: String
  },
  data: () => ({
    list: ['Все', 'Комментарии', 'Друзья']
  }),
  methods: {
    changePushSidebar(item) {
      this.$emit('change-push-sidebar', item)
    }
  }
}
</script>