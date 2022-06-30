<template lang="pug">
  .push(:class="{open: isOpen}")
    .push__overlay(@click.stop="closePush")
    .push__wrap(:class="{open: isOpen}" ref="wrap")
      .push__list(ref="list")
        .push__item(v-for="info in getNotifications.slice(0,10)" :key="info.id")
          .push__img
            img(:src="info.entity_author.photo" :alt="info.entity_author.first_name")
          p.push__content
            router-link.push__content-name(:to="getRouteByNotification(info)")
              | {{info.entity_author.first_name + ' ' + info.entity_author.last_name}}
              |
              | {{getNotificationsTextType(info.event_type)}}
            span.push__content-preview  «{{info.info}}»
            button.btn_readnot(v-on:click="readNot(info)") Просмотреть  
          span.push__time {{info.sent_time | moment('from')}}
      router-link.push__btn(:to="{name: 'Push'}" v-if="getNotificationsLength > 1") Показать все ({{getNotificationsLength}})
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { getRouteByNotification } from '@/utils/notifications.utils.js';
export default {
  name: 'Push',
  props: {
    isOpen: Boolean
  },
  computed: {
    ...mapGetters('profile/notifications', ['getNotifications', 'getNotificationsLength', 'getNotificationsTextType'])
  },
  watch: {
    isOpen(val) {
      if (val) {
        this.$refs.list.scrollTop = 0
        // this.readNotifications()
      }
    }
  },
  methods: {
    ...mapActions('profile/notifications', ['apiNotifications', 'readNotifications', 'readNotification']),
    ...mapMutations('profile/notifications', ['routePushWithQuery']),
    readNot(info) {
      this.routePushWithQuery(info.event_type)
    },
    getRouteByNotification,
    closePush() {
      if (!this.isOpen) return
      this.$emit('close-push')
    }
  },
  mounted() {
    if (this.getNotificationsLength === 0) this.apiNotifications()
    if (window.innerHeight - this.$refs.wrap.getBoundingClientRect().top - this.$refs.wrap.offsetHeight < 0) {
      this.$refs.wrap.style.maxHeight = `${window.innerHeight - this.$refs.wrap.getBoundingClientRect().top}px`
    }
    window.onscroll = () => {
      this.closePush()
    }
  }
}
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl';

.push {
  .push__overlay {
    display: none;
  }

  &.open {
    .push__overlay {
      display: block;
    }
  }
}

.btn_readnot {
  background-color: #21a45d;
  margin-left: 10px;
  padding: 5px;
  border-radius: 10px;
  color: white;
}

.push__overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  cursor: default;
}

.push__wrap {
  position: fixed;
  background: #FFf;
  box-shadow: 0px 2px 60px rgba(0, 0, 0, 0.1);
  right: 50px;
  top: header-height;
  width: 100%;
  max-width: 710px;
  max-height: 675px;
  z-index: 100;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-20px);
  transition: all 0.2s;
  overflow-y: auto;

  &.open {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }

  &:before, &:after {
    content: '';
    display: block;
    width: 19px;
    height: 38px;
    position: absolute;
    top: -16px;
  }

  &:before {
    background-image: linear-gradient(115deg, transparent 50%, #fff 50%);
    right: 223px;
  }

  &:after {
    background-image: linear-gradient(245deg, transparent 50%, #fff 50%);
    right: 205px;
  }
}

.push__list {
  overflow-y: auto;
  max-height: 543px;
}

.push__item {
  display: flex;
  align-items: center;
  padding: 35px 0;
  margin: 0 40px;

  &+& {
    border-top: 1px solid #E7E7E7;
  }
}

.push__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 15px;
  letter-spacing: 0.01em;
  color: eucalypt;
  border-top: 1px solid #E7E7E7;
  height: 85px;
}
</style>
