<template lang="pug">
  .news-add(@click="openForm" :class="{open: isOpen}")
    .news-add__mask(v-if="!isOpen")
      template(v-if="getInfo")
        .news-add__pic(v-if="user")
          img(:src="getInfo.photo" :alt="getInfo.fullName")
      span.news-add__placeholder Поделитесь новостью...
      //- .news-add__block.photo
      //-   simple-svg(:filepath="'/static/img/photo.svg'")
      //- .news-add__block.add
      //-   simple-svg(:filepath="'/static/img/add.svg'")
    add-form(v-else @submit-complete="closeForm")
</template>

<script>
import { mapGetters } from 'vuex'
import AddForm from '@/components/News/AddForm'

export default {
  name: 'NewsAdd',
  props: {
    user: Boolean
  },
  components: { AddForm },
  data: () => ({
    isOpen: false
  }),
  computed: {
    ...mapGetters('profile/info', ['getInfo'])
  },
  methods: {
    openForm() {
      this.isOpen = true
    },
    closeForm() {
      this.isOpen = false
    }
  }
}
</script>
