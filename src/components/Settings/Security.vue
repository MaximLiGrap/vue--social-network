<template lang="pug">
  .settings-security
    .settings-security__block
      h3.settings-security__title E-mail:
      span.settings-security__value {{getInfo.email}}
      button-hover(@click.native="openModal('email')") Изменить
    .settings-security__block
      h3.settings-security__title Пароль:
      span.settings-security__value ********
      button-hover(@click.native="openModal('password')") Изменить
    modal(v-model="modalShow")
      p(v-if="modalText") {{modalText}}
      template(slot="actions")
        button-hover(@click.native="closeModal") Ок
</template>

<script>
import Modal from '@/components/Modal'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'SettingsSecurity',
  components: { Modal },
  data: () => ({
    modalShow: false,
    modalText: ''
  }),
  computed: {
    ...mapGetters('profile/info', ['getInfo'])
  },
  methods: {
    ...mapActions('profile/account', ['passwordRecovery', 'changeEmail']),
    closeModal() {
      this.modalShow = false
    },
    openModal(id) {
      id === 'email'
        ? (this.modalText = 'На ваш E-mail было отправлено письмо с подтверждением смены.') && this.changeEmail({email: this.getInfo.email})
        : (this.modalText = 'На ваш E-mail было отправлено письмо с ссылкой для смены пароля.') && this.passwordRecovery({email: this.getInfo.email})
      this.modalShow = true
    }
  }
}
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl';

.settings-security__block {
  background: #fff;
  box-shadow: standart-boxshadow;
  display: flex;
  align-items: center;
  height: 95px;
  padding: 0 33px 0 50px;
  font-size: 15px;

  &+& {
    margin-top: 20px;
  }
}

.settings-security__title {
  color: #5F5E7A;
  width: 100px;
}

.settings-security__value {
  color: #414141;
  display: block;
  margin-right: auto;
}
</style>
