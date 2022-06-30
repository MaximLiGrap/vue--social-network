<template lang="pug">
  .change-password
    h2.change-password__title.form__title Новый пароль
    form.change-password__form(@submit.prevent="submitHandler")
      password-field(id="change-password" v-model="password" :v="$v.password" info registration :class="{checked: $v.password.required && $v.passwordTwo.sameAsPassword}")
      password-repeat-field(id="change-repeat-password" v-model="passwordTwo" :v="$v.passwordTwo" :class="{checked: $v.password.required && $v.passwordTwo.sameAsPassword}")
      .change-password__action
        button-hover(tag="button" type="submit" variant="white") Отправить
</template>

<script>
import { required, sameAs, minLength } from 'vuelidate/lib/validators'
import PasswordField from '@/components/FormElements/PasswordField'
import PasswordRepeatField from '@/components/FormElements/PasswordRepeatField'
import { mapActions } from 'vuex'
export default {
  name: 'ChangePassword',
  components: {
    PasswordField,
    PasswordRepeatField
  },
  data: () => ({
    password: '',
    passwordTwo: ''
  }),
  methods: {
    ...mapActions('profile/account', ['passwordSet']),
    submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }

      this.passwordSet({token: this.$route.query.token, password: this.passwordTwo}).then(() => {
        this.$router.push({ name: 'ChangePasswordSuccess' })
      })
    }
  },
  validations: {
    password: { required, minLength: minLength(8) },
    passwordTwo: { required, sameAsPassword: sameAs('password') }
  }
}
</script>

<style lang="stylus">
.change-password {
  display: flex;
  justify-content: center;
  flex-direction: column;
  height: 100%;
}

.change-password__title {
  margin-bottom: 50px;
}

.change-password__action {
  margin-top: 50px;
}
</style>
