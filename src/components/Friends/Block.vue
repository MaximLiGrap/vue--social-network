<template lang="pug">
  .friends-block
    .friends-block__img
      img(:src="info.photo" :alt="info.first_name")
    .friends-block__info
      router-link.friends-block__name(:to="{name: 'ProfileId', params: {id: info.id}}") {{info.first_name}} {{info.last_name}}
      span.friends-block__age-city(v-if="moderator") модератор
      span.friends-block__age-city(v-else-if="info.birth_date && info.city") {{info.birth_date | moment('from', true)}}, {{info.city}}
      span.friends-block__age-city(v-else) профиль не заполнен
    .friends-block__actions
      template(v-if="moderator")
        .friends-block__actions-block(v-tooltip.bottom="'Редактировать'")
          simple-svg(:filepath="'/static/img/edit.svg'")
        .friends-block__actions-block(v-tooltip.bottom="'Удалить из списка'" @click="openModal('deleteModerator')")
          simple-svg(:filepath="'/static/img/delete.svg'")
      template(v-else-if="admin")
        .friends-block__actions-block(v-tooltip.bottom="'Разблокировать'" v-if="blocked")
          simple-svg(:filepath="'/static/img/unblocked.svg'")
        .friends-block__actions-block(v-tooltip.bottom="'Заблокировать'" v-else)
          simple-svg(:filepath="'/static/img/blocked.svg'")
      template(v-else)
        .friends-block__actions-block.message(v-tooltip.bottom="'Написать сообщение'" @click="sendMessage(info.id)")
          simple-svg(:filepath="'/static/img/sidebar/im.svg'")
        .friends-block__actions-block.delete(v-tooltip.bottom="'Удалить из друзей'" @click="openModal('delete')" v-if="friend")
          simple-svg(:filepath="'/static/img/delete.svg'")
        .friends-block__actions-block.add(v-tooltip.bottom="'Добавить в друзья'" @click="apiAddFriends(info.id)" v-else)
          simple-svg(:filepath="'/static/img/friend-add.svg'")
        .friends-block__actions-block(v-tooltip.bottom="'Заблокировать'" @click="openModal('blocked')")
          simple-svg(:filepath="'/static/img/friend-blocked.svg'")
    modal(v-model="modalShow")
      p(v-if="modalText") {{modalText}}
      template(slot="actions")
        button-hover(@click.native="onConfrim(info.id)") Да
        button-hover(variant="red" bordered @click.native="closeModal") Отмена
</template>

<script>
import Modal from '@/components/Modal'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'FriendsBlock',
  props: {
    friend: Boolean,
    admin: Boolean,
    blocked: Boolean,
    moderator: Boolean,
    info: {
      type: Object,
      default: () => ({
        first_name: 'Артем',
        last_name: 'Иващенко',
        birth_date: 1559751301818,
        town_id: 1,
        photo: '/static/img/user/1.jpg',
        id: 124
      })
    }
  },
  components: { Modal },
  data: () => ({
    modalShow: false,
    modalType: 'delete'
  }),
  computed: {
    ...mapGetters('profile/dialogs', ['dialogs']),
    modalText() {
      return this.modalType === 'delete'
        ? `Вы уверены, что хотите удалить пользователя ${this.info.first_name + ' ' + this.info.last_name} из друзей?`
        : this.modalType === 'deleteModerator'
        ? `Вы уверены, что хотите удалить ${this.info.first_name + ' ' + this.info.last_name} из списка модераторов?`
        : `Вы уверены, что хотите заблокировать пользователя ${this.info.first_name + ' ' + this.info.last_name}?`
    }
  },
  methods: {
    ...mapActions('profile/friends', ['apiAddFriends', 'apiDeleteFriends']),
    // ...mapActions('profile/dialogs', ['openDialog']),
    ...mapActions('users/actions', ['apiBlockUser', 'apiUnblockUser']),
    closeModal() {
      this.modalShow = false
    },
    openModal(id) {
      this.modalType = id
      this.modalShow = true
    },
    sendMessage(userId) {
      this.$router.push({ name: 'Im', query: { userId: userId } })
    },
    onConfrim(id) {
      this.modalType === 'delete'
        ? this.apiDeleteFriends(id).then(() => this.closeModal())
        : this.modalType === 'deleteModerator'
        ? console.log('delete moderator')
        : this.apiBlockUser(id).then(() => this.closeModal())
    }
  }
}
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl';

.friends-block {
  align-items: center;
  background: #fff;
  box-shadow: standart-boxshadow;
  padding: 20px;
  width: 100%;
  max-width: calc(50% - 20px);
  display: inline-flex;
  margin: 0 10px 20px;
}

.friends-block__img {
  width: 65px;
  height: 65px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 30px;
  flex: none;

  @media (max-width: breakpoint-xxl) {
    margin-right: 10px;
  }

  img {
    width: 100%;
  }
}

.friends-block__info {
  margin-right: auto;
}

.friends-block__name {
  font-weight: 600;
  font-size: 18px;
  line-height: 27px;
  color: steel-gray;
  display: block;

  @media (max-width: breakpoint-xxl) {
    font-size: 14px;
  }
}

.friends-block__age-city {
  font-size: 15px;
  line-height: 22px;
  color: #5A5A5A;

  @media (max-width: breakpoint-xxl) {
    font-size: 13px;
  }
}

.friends-block__actions {
  display: flex;
  align-items: center;
}

.friends-block__actions-block {
  cursor: pointer;

  @media (max-width: breakpoint-xxl) {
    &+& {
      margin-left: 5px;
    }
  }

  &+& {
    margin-left: 10px;
  }

  &.message {
    margin-top: 5px;

    .simple-svg {
      fill: eucalypt;
    }
  }

  &.delete {
    margin-top: 3px;
  }

  &.add {
    margin-top: 2px;
    margin-left: 15px;
  }

  .simple-svg-wrapper {
    width: 20px;
    height: 20px;
  }
}
</style>
