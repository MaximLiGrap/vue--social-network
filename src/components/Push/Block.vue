<template lang="pug">
  .push-block
    .push__img
      img(:src="info.entity_author.photo" :alt="info.entity_author.first_name")
    p.push__content
      router-link.push__content-name(:to="getRouteByNotification(info)")
        | {{info.entity_author.first_name + ' ' + info.entity_author.last_name}}
        |
        | {{getNotificationsTextType(info.event_type)}}
      span.push__content-preview «{{info.info}}»
    span.push__time {{info.sent_time | moment('from')}}
</template>

<script>
import { mapGetters } from 'vuex'
import { getRouteByNotification } from '@/utils/notifications.utils.js'
export default {
  name: 'PushBlock',
  props: {
    info: Object
  },
  computed: {
    ...mapGetters('profile/notifications', ['getNotificationsTextType'])
  },
  methods: {
    getRouteByNotification
  }
}
</script>

<style lang="stylus">
.push-block {
  background: #fff;
  padding: 25px 30px;
  box-shadow: 0px 2px 60px rgba(0, 0, 0, 0.1);
  display: flex;

  &+& {
    margin-top: 20px;
  }

  .push__img {
    flex: none;
  }

  .push__content {
    max-width: 650px;
    padding-top: 10px;
  }

  .push__time {
    flex: none;
    padding-top: 20px;
  }
}
</style>
