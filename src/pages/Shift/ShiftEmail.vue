<template lang="pug">
  .shift-email
    form.shift-email__form(@submit.prevent="submitHandler")
      .form__block
        h4.form__subtitle Смена почтового ящика
        email-field(id="shift-email" v-model="email" :v="$v.email" :class="{checked: $v.email.required && $v.email.email}" placeholder="Новый почтовый ящик")
      .form__block
        h4.form__subtitle Введите код
        span.form__code {{code}}
        number-field(id="shift-number" v-model="number" :v="$v.number" :class="{checked: $v.number.required && $v.number.isCode}")
      .shift-email__action
        button-hover(tag="button" type="submit" variant="white") Сменить
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { required, email, numeric } from 'vuelidate/lib/validators'
import NumberField from '@/components/FormElements/NumberField'
import EmailField from '@/components/FormElements/EmailField'
import store from '@/store'

const isCode = value => +value === store.state.code

export default {
  name: 'ShiftEmail',
  components: {
    NumberField,
    EmailField
  },
  data: () => ({
    email: '',
    code: 0,
    number: ''
  }),
  computed: {
    ...mapGetters(['getCode'])
  },
  methods: {
    ...mapActions('profile/account', ['changeEmailSet']),
    submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }
      this.changeEmailSet({token: this.$route.query.token, email: this.email}).then(() => {
        this.$router.push({ name: 'ShiftEmailSuccess' })
      })
    }
  },
  mounted() {
    this.code = this.getCode
  },
  validations: {
    email: { required, email },
    number: {
      required,
      numeric,
      isCode
    }
  }
}
</script>

<style lang="stylus">
.shift-email {
  display: flex;
  justify-content: center;
  flex-direction: column;
  height: 100%;
}

.shift-email__title {
  margin-bottom: 20px;
}

.shift-email__action {
  margin-top: 40px;
}
</style>
