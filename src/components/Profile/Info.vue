<template lang="pug">
  .profile-info(v-if="info")
    .profile-info__pic
      .profile-info__img(:class="{offline: !online && !me}")
        img(:src="info.photo" :alt="info.fullName")
      .profile-info__actions(v-if="!me")
        button-hover(:disable="blocked" @click.native="onSentMessage") Написать сообщение
        button-hover.profile-info__add(:variant="btnVariantInfo.variant" bordered  @click.native="profileAction") {{btnVariantInfo.text}}
    .profile-info__main
      router-link.edit(v-if="me" :to="{name: 'Settings'}")
        simple-svg(:filepath="'/static/img/edit.svg'")
      span.profile-info__blocked(:class="{blocked}" v-else @click="blockedUser") {{blockedText}}
      .profile-info__header
        h1.profile-info__name {{info.fullName}}
        span.user-status(:class="{online, offline: !online}") {{statusText}}
      div.profile-reset(v-if="info.is_deleted") Ваш аккаунт скоро будет удалён
        button.profile-reset__btn(@click="reset()") Восстановить
      .profile-info__block
        span.profile-info__title Дата рождения:
        span.profile-info__val(v-if="info.birth_date>=100051200000") {{info.birth_date | moment("D MMMM YYYY") }} ({{info.ages}} года)
        span.profile-info__val(v-else-if="info.birth_date<100051200000") {{ data(info.birth_date) }} ({{info.ages}} года)
        span.profile-info__val(v-else) не заполнено
      .profile-info__block
        span.profile-info__title Телефон:
        a.profile-info__val(v-if="info.phone" :href="`tel:${info.phone}`") {{info.phone | phone}}
        a.profile-info__val(v-else) не заполнено
      .profile-info__block
        span.profile-info__title Страна, город:
        span.profile-info__val(v-if="info.country") {{info.country}}, {{info.city}}
        span.profile-info__val(v-else) не заполнено
      .profile-info__block
        span.profile-info__title О себе:
        span.profile-info__val(v-if="info.about") {{info.about}}
        span.profile-info__val(v-else) не заполнено
    modal(v-model="modalShow")
      p(v-if="modalText") {{modalText}}
      template(slot="actions")
        button-hover(@click.native.prevent="onConfirm") Да
        button-hover(variant="red" bordered @click.native="closeModal") Отмена
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import axios from 'axios'
import Modal from '@/components/Modal'


export default {
  name: 'ProfileInfo',
  components: { Modal },
  props: {
    me: Boolean,
    online: Boolean,
    blocked: Boolean,
    friend: Boolean,
    info: Object
  },
  data: () => ({
    modalShow: false,
    modalText: '',
    modalType: 'deleteFriend'
  }),
  computed: {
    ...mapGetters('profile/dialogs', ['dialogs']),
    statusText() {
      return this.online ? 'онлайн' : 'не в сети'
    },
    blockedText() {
      return this.blocked ? 'Пользователь заблокирован' : 'Заблокировать'
    },
    btnVariantInfo() {
      return this.blocked
        ? { variant: 'red', text: 'Разблокировать' }
        : this.friend
        ? { variant: 'red', text: 'Удалить из друзей' }
        : { variant: 'white', text: 'Добавить в друзья' }
    }
  },
  methods: {
    data(time) {
      let dat = new Date(time);
      let isoDate = dat.toISOString()
      return isoDate.substr(0, 10)
    },
    ...mapActions('users/actions', ['apiBlockUser', 'apiUnblockUser']),
    ...mapActions('profile/friends', ['apiAddFriends', 'apiDeleteFriends']),
    ...mapActions('profile/dialogs', ['createDialogWithUser', 'apiLoadAllDialogs']),
    ...mapActions('users/info', ['apiInfo']),
    blockedUser() {
      if (this.blocked) return
      this.modalText = `Вы уверены, что хотите заблокировать пользователя ${this.info.fullName}`
      this.modalShow = true
      this.modalType = 'block'
    },
    profileAction() {
      if (this.blocked) {
        this.apiUnblockUser(this.$route.params.id).then(() => {
          this.apiInfo(this.$route.params.id)
        })
        return
      }
      if (this.friend) {
        this.modalText = `Вы уверены, что хотите удалить пользователя ${this.info.fullName} из друзей?`
        this.modalShow = true
        this.modalType = 'deleteFriend'
        return
      }
      this.apiAddFriends(this.info.id).then(() => {
        this.apiInfo(this.$route.params.id)
      })
    },
    closeModal() {
      this.modalShow = false
    },
    onConfirm() {
      if (this.modalType === 'block') {
        this.apiBlockUser(this.$route.params.id).then(() => {
          this.apiInfo(this.$route.params.id)
          this.closeModal()
        })
        return
      }
      this.apiDeleteFriends(this.$route.params.id).then(() => {
        this.apiInfo(this.$route.params.id)
        this.closeModal()
      })
    },
    onSentMessage() {
      if (this.blocked) return false
      this.$router.push({ name: 'Im', query: { userId: this.info.id } })
    },
    reset() {
        axios({
        url: `users/me/return`,
        method: 'PUT',
        })
          .then(response => {
        })
        .catch(error => {
          console.error(error)
        })
    }
  }
}
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl';

.profile-info {
  display: flex;
  padding: 25px 30px 25px 50px;
  background: #FFFFFF;
  box-shadow: standart-boxshadow;
  position: relative;

  @media (max-width: breakpoint-xxl) {
    padding: 25px;
  }
}

.profile-reset {
  padding: 10px 0;
}

.profile-reset__btn {
  margin-left: 20px;
  background-color: #21a45d;
  padding: 5px;
}

.profile-info__pic {
  border-right: 1px solid #E6E6E6;
  padding-right: 55px;
  margin-right: 60px;

  @media (max-width: breakpoint-xxl) {
    margin-right: 20px;
    padding-right: 20px;
  }
}

.profile-info__img {
  width: 215px;
  height: 215px;
  border-radius: 50%;
  overflow: hidden;
  border: 5px solid #21A45D;

  @media (max-width: breakpoint-xxl) {
    width: 150px;
    height: 150px;
    margin: 0 auto;
  }

  img {
    width: 100%;
  }

  &.offline {
    border-color: #747474;
  }
}

.profile-info__actions {
  margin-top: 25px;
  max-width: 215px;

  @media (max-width: breakpoint-xxl) {
    max-width: 180px;
  }

  .btn {
    width: 100%;
  }
}

.profile-info__add {
  margin-top: 10px;
}

.profile-info__main {
  padding: 20px 0;
}

.profile-info__blocked {
  position: absolute;
  top: 30px;
  right: 45px;
  color: eucalypt;
  font-size: 15px;
  letter-spacing: 0.01em;
  cursor: pointer;

  &.blocked {
    color: #47474C;
    cursor: default;
  }
}

.profile-info__header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.profile-info__name {
  font-family: font-exo;
  font-weight: 200;
  font-size: 30px;
  line-height: 24px;
  color: #000000;
  margin-right: 15px;
}

.profile-info__block {
  display: flex;
  font-size: 15px;

  &+& {
    margin-top: 5px;
  }

  &:last-child {
    margin-top: 30px;
  }
}

.profile-info__title {
  width: 100%;
  max-width: 200px;
  flex: none;
  color: #47474C;

  @media (max-width: breakpoint-xxl) {
    max-width: 150px;
  }
}

.profile-info__val {
  color: #747487;
  line-height: 25px;
}
</style>
