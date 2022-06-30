<template lang="pug">
  .search-filter
    .search-filter__block
      label.search__label(for="search-news-author") Автор:
      input.search__input(type="text" id="search-news-author" v-model="author")
    .search-filter__block.time
      label.search__label Время публикации:
      select.select.search-filter__select(v-model="date_from")
        option(value="year") За последний год
        option(value="month") За последний месяц
        option(value="week") За последнюю неделю
    .search-filter__block.tags
      add-tags(:tags="tags" @change-tags="onChangeTags")
    .search-filter__block.btn-news
      button-hover(@click.native="onSearchNews") Применить
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
import AddTags from '@/components/News/AddTags'
export default {
  name: 'SearchFilterNews',
  components: { AddTags },
  data: () => ({
    tags: [],
    date_from: 'year',
    date_to: 0,
    offset: 0,
    itemPerPage: 20,
    author: ''
  }),
  computed: {
    ...mapGetters('global/search', ['searchText'])
  },
  methods: {
    ...mapActions('global/search', ['searchNews']),
    onChangeTags(tags) {
      this.tags = tags
    },
    onSearchNews() {
      this.searchNews({
        text: this.searchText,
        date_from: moment()
          .subtract(1, this.date_from)
          .valueOf(),
        date_to: this.date_to,
        author: this.author,
        tags: this.tags
      })
    }
  },
  mounted() {
    this.date_to = moment().valueOf()
  }
}
</script>