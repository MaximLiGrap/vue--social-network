<template lang="pug">
  .shift-password
    form.shift-password__form(@submit.prevent="submitHandler")
      .form__block
        h4.form__subtitle Смена пароля
        email-field(id="shift-email" v-model="email" :v="$v.email" :class="{checked: $v.email.required && $v.email.email}")
        password-field(id="shift-password" v-model="password" :v="$v.password" info registration :class="{checked: $v.password.required && $v.passwordTwo.sameAsPassword}")
        password-repeat-field(id="shift-repeat-password" v-model="passwordTwo" :v="$v.passwordTwo" :class="{checked: $v.password.required && $v.passwordTwo.sameAsPassword}")
      .form__block
        h4.form__subtitle Введите код
        span.form__code {{code}}
        number-field(id="shift-number" v-model="number" :v="$v.number" :class="{checked: $v.number.required && $v.number.isCode}")
      .shift-password__action
        button-hover(tag="button" type="submit" variant="white") Сменить
</template>

<script>
import { mapGetters } from 'vuex'
import { required, email, sameAs, minLength, numeric } from 'vuelidate/lib/validators'
import PasswordField from '@/components/FormElements/PasswordField'
import PasswordRepeatField from '@/components/FormElements/PasswordRepeatField'
import NumberField from '@/components/FormElements/NumberField'
import EmailField from '@/components/FormElements/EmailField'
import store from '@/store'

const isCode = value => +value === store.state.code

export default {
  name: 'ShiftPasssword',
  components: {
    PasswordField,
    PasswordRepeatField,
    NumberField,
    EmailField
  },
  data: () => ({
    email: '',
    password: '',
    passwordTwo: '',
    code: 3675,
    number: ''
  }),
  computed: {
    ...mapGetters(['getCode'])
  },
  methods: {
    submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }
    }
  },
  mounted() {
    this.code = this.getCode
  },
  validations: {
    email: { required, email },
    password: { required, minLength: minLength(8) },
    passwordTwo: { required, sameAsPassword: sameAs('password') },
    number: {
      required,
      numeric,
      isCode
    }
  }
}
</script>

<style lang="stylus">
.shift-password {
  display: flex;
  justify-content: center;
  flex-direction: column;
  height: 100%;
}

.shift-password__title {
  margin-bottom: 20px;
}

.shift-password__action {
  margin-top: 40px;
}
</style>
