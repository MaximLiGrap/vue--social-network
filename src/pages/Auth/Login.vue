<template lang="pug">
  .login
    h2.login__title.form__title Войдите в аккаунт
    form.login__form(@submit.prevent="submitHandler")
      email-field(id="login-email" v-model="email" :v="$v.email")
      password-field(id="login-password" v-model="password" :v="$v.password")
      .login__action
        button-hover(tag="button" type="submit" variant="white") Войти
        router-link.login__link(:to="{name: 'Forgot'}") Забыли пароль?
</template>

<script>
import { mapActions } from 'vuex'
import { required, email, minLength } from 'vuelidate/lib/validators'
import PasswordField from '@/components/FormElements/PasswordField'
import EmailField from '@/components/FormElements/EmailField'
export default {
  name: 'Login',
  components: {
    PasswordField,
    EmailField
  },
  data: () => ({
    email: '',
    password: ''
  }),
  computed: {
    redirectUrl() {
      return this.$route.query.redirect
    }
  },
  methods: {
    ...mapActions('auth/api', ['login']),
    ...mapActions('profile/info', ['apiInfo']),
    submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }

      this.login({ email: this.email, password: this.password }).then(() => {
        this.apiInfo().then(() => {
          this.$router.push({ name: this.redirectUrl || 'News' })
        })
      })
    }
  },
  validations: {
    email: { required, email },
    password: { required, minLength: minLength(8) }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../assets/stylus/base/vars.styl';

.login {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.login__title {
  margin-bottom: 50px;
}

.login__action {
  display: flex;
  align-items: center;
  margin-top: 50px;
}

.login__link {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  margin-left: 30px;
  white-space: nowrap;
  transition: all 0.2s;

  &:hover {
    color: #fff;
  }
}
</style>
