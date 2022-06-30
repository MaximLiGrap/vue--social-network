<template lang="pug">
  #app
    component(:is="layout" v-if="$route.meta.layout")
      router-view
    v-snackbar(:value="getState.show" :timeout="getState.timeout" :color="getState.status" right bottom) {{getState.text}}
</template>

<script>
import { VSnackbar } from 'vuetify/lib'
import { mapGetters } from 'vuex'
import FormLayout from '@/layouts/FormLayout'
import MainLayout from '@/layouts/MainLayout'
import EmptyLayout from '@/layouts/EmptyLayout'


export default {
  name: 'App',
  components: {
    FormLayout,
    MainLayout,
    EmptyLayout,
    VSnackbar
  },
  computed: {
    ...mapGetters('global/alert', ['getState']),
    layout() {
      return this.$route.meta.layout + '-layout'
    }
  }
}
</script>

<style lang="stylus">
@import './assets/stylus/main.styl';

.v-snack__wrapper {
  &.success {
    background-color: eucalypt;
  }

  &.error {
    background-color: wild-watermelon;
  }
}
</style>
