<template lang="pug">
  .im-dialog(:class="{active, push}")
    router-link.im-dailog__pic(:to="{name: 'ProfileId', params: {id: info.last_message.recipient.id}}")
      img(:src="info.last_message.recipient.photo" :alt="info.last_message.recipient.first_name")
    .im-dialog__info
      router-link.im-dialog__name(:to="{name: 'ProfileId', params: {id: info.last_message.recipient.id}}") {{info.last_message.recipient.first_name + ' ' + info.last_message.recipient.last_name}}
      span.user-status(:class="{online}") {{statusText}}
    .im-dialog__content
      p.im-dialog__last
        span.im-dialog__last-me(v-if="me") Вы: 
        | {{info.last_message.message_text}}
      span.im-dialog__time {{info.last_message.time | moment('from')}}
    button.delete(@click="deleteDilog(info.id)")
      simple-svg(:filepath="'/static/img/delete.svg'")
    span.im-dialog__push(v-if="push > 0") {{push}}
</template>

<script>
import moment from 'moment'
import { mapActions } from 'vuex'
export default {
  name: 'ImDialog',
  props: {
    active: Boolean,
    push: Number,
    online: Boolean,
    me: Boolean,
    info: Object
  },
  methods: {
    ...mapActions('profile/dialogs', [
      'deleteDialogs',
      'loadFreshMessages', 'apiLoadAllDialogs'
    ]),
    deleteDilog(id) {
      this.deleteDialogs(id)
    },
  },
  computed: {
    statusText() {
      return this.online
        ? 'Онлайн'
        : 'был в сети ' + moment(this.info.last_message.recipient.last_online_time).fromNow()
    }
  },
  // created() {
  //   connect()
  // },
  // beforeRouteUpdate(to, from, next) {
  //   disconnect()
  //   next()
  // },
  // beforeDestroy() {
  //   disconnect()
  // }
}
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl';
.delete {
  width: 16px;
  height: 16px;
}
.im-dialog {
  display: flex;
  align-items: center;
  height: 100px;
  position: relative;
  padding: 0 6.38%;
  z-index: 0;
  cursor: pointer;

  &:before {
    content: '';
    display: none;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: #F8FAFD;
    z-index: -1;
  }

  &:after {
    content: '';
    display: block;
    height: 1px;
    width: 87.24%;
    background-color: #E3E8EE;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }

  &.push + &.active, &.active + &.push {
    &:after {
      display: none;
    }
  }

  &.active {
    &:after {
      display: none;
    }

    &:before {
      display: block;
    }
  }

  &.push {
    &:after {
      display: none;
    }

    &:before {
      display: block;
      background-color: #E9F5EF;
    }

    .im-dialog__content {
      max-width: 30%;
    }

    .im-dialog__time {
      color: #7D9A8B;
    }
  }
}

.im-dailog__pic {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 15px;
  flex: none;
}

.im-dialog__info {
  width: 100%;
  max-width: 27.11%;
  min-width: 150px;
  margin-right: 30px;

  @media (max-width: breakpoint-xl) {
    display: none;
  }
}

.im-dialog__name {
  font-size: 15px;
  line-height: 22px;
  color: steel-gray;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.im-dialog__content {
  max-width: 37%;

  @media (max-width: breakpoint-xl) {
    display: none;
  }
}

.im-dialog__last {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 13px;
  line-height: 18px;
  letter-spacing: -0.003em;

  &-me {
    color: eucalypt;
  }
}

.im-dialog__time {
  color: #A4A4B8;
  font-size: 13px;
  line-height: 19px;
}

.im-dialog__push {
  width: 27px;
  height: 27px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  line-height: 27px;
  font-weight: 600;
  color: #fff;
  background-color: #E65151;
  margin-left: auto;
}
</style>
