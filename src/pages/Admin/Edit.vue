<template lang="pug">
  .admin-edit.inner-page.admin
    .admin__title Добавить модератора/администратора
    form.admin-edit__form(action="#" @submit.prevent="")
      user-info-form-block(label="Имя:" v-model="name" )
      user-info-form-block(label="E-Mail:" v-model="email" )
      user-info-form-block(label="Пароль:" v-model="password" )
      user-info-form-block(label="Повторите пароль:" v-model="passwordTwo" )
      .user-info-form__block
        span.user-info-form__label Тип
        .user-info-form__wrap
</template>

<script>
import UserInfoFormBlock from '@/components/Settings/UserInfoForm/Block.vue'
export default {
  name: 'AdminEdit',
  components: { UserInfoFormBlock },
  data: () => ({
    name: '',
    email: '',
    password: '',
    passwordTwo: ''
  })
}
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl';

.admin-edit__form {
  max-width: 610px;
  width: 100%;
  background: #fff;
  box-shadow: standart-boxshadow;
  padding: 60px 85px 55px 40px;

  .user-info-form__block + .user-info-form__block {
    margin-top: 15px;
  }

  .user-info-form__label {
    width: 120px;
    white-space: normal;
  }
}
</style>
