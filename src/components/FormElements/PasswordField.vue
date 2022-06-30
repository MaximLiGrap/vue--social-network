<template lang="pug">
  .form__group(:class="{fill: password.length > 0}")
    label.form__label(:for="id") Пароль
    input.form__input(name="password" :id="id"
      :type="passwordFieldType" 
      v-model.trim="password"
      @change="passwordBlur"
      :class="{invalid: ((v.$dirty && !v.required) || (v.$dirty && !v.minLength))}"
    )
    span.form__error(v-if="v.$dirty && !v.required") Введите пароль
    .form__error-block
      template(v-if="registration")
        span.form__password-helper(:class="levelInfo.class")
        span.form__error(v-if="password.length>=3") {{levelInfo.text}}
      template(v-else)
        span.form__error(v-if="v.$dirty && !v.minLength") Пароль должен быть не менее {{v.$params.minLength.min}} символов. Сейчас он {{password.length}}
    template(v-if="info")
      .form__password-icon.active
        simple-svg(:filepath="'/static/img/password-info.svg'")
      p.form__password-info Пароль должен состоять из латинских букв, цифр и знаков. Обязательно содержать одну заглавную букву, одну цифру и состоять из 8 символов.
    .form__password-icon(:class="{'active': password.length > 0}" @click="switchVisibility" v-if="!registration")
      simple-svg(:filepath="'/static/img/password-eye.svg'")
</template>

<script>
export default {
  name: 'PasswordField',
  props: {
    value: {
      type: String,
      default: ''
    },
    v: {
      type: Object,
      required: true
    },
    info: Boolean,
    registration: Boolean,
    id: {
      type: String,
      required: true
    }
  },
  data: () => ({
    passwordFieldType: 'password',
    passwordHelperShow: true
  }),
  computed: {
    password: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    },
    levelInfo() {
      if (!this.passwordHelperShow) return { text: null, class: null }
      return this.password.length >= 3 && this.password.length < 7
        ? { text: 'слабый', class: 'easy' }
        : this.password.length >= 7 && this.password.length < 11
        ? { text: 'средний', class: 'middle' }
        : this.password.length >= 11 && { text: 'надёжный', class: 'hard' }
    }
  },
  methods: {
    switchVisibility() {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password'
    },
    passwordBlur() {
      this.passwordHelperShow = false
      this.v.$touch()
    }
  }
}
</script>

