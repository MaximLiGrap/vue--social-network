<template lang="pug">
  .registration
    form.registration__form(@submit.prevent="submitHandler")
      .form__block
        h4.form__subtitle Аккаунт
        email-field(id="register-email" v-model="email" :v="$v.email" :class="{checked: $v.email.required && $v.email.email}")
        password-field(id="register-password" v-model="passwd1" :v="$v.passwd1" info registration :class="{checked: $v.passwd1.required && $v.passwd2.sameAsPassword && $v.passwd1.minLength}")
        password-repeat-field(id="register-repeat-password" v-model="passwd2" :v="$v.passwd2" :class="{checked: $v.passwd1.required && $v.passwd2.sameAsPassword && $v.passwd2.minLength}")
      .form__block
        h4.form__subtitle Личные данные
        name-field(id="register-firstName" v-model="firstName" :v="$v.firstName")
        name-field(id="register-lastName" v-model="lastName" :v="$v.lastName" label="Фамилия")
      .form__block
        h4.form__subtitle Введите код
        img.capch(:src="this.image", alt="")
        number-field(id="register-number" v-model="number" :v="$v.number" :isCode="isCode")
        confirm-field(id="register-confirm" v-model="confirm" :v="$v.confirm")
      .registration__action
        button-hover(tag="button" type="submit" variant="white") Зарегистрироваться
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { required, email, minLength, sameAs, numeric } from 'vuelidate/lib/validators'
import PasswordField from '@/components/FormElements/PasswordField'
import PasswordRepeatField from '@/components/FormElements/PasswordRepeatField'
import EmailField from '@/components/FormElements/EmailField'
import NameField from '@/components/FormElements/NameField'
import NumberField from '@/components/FormElements/NumberField'
import ConfirmField from '@/components/FormElements/ConfirmField'
import store from '@/store'
import axios from 'axios'


export default {
  name: 'Registration',
  components: {
    PasswordField,
    EmailField,
    NameField,
    NumberField,
    ConfirmField,
    PasswordRepeatField
  },
  data: () => ({
    email: '',
    passwd1: '',
    passwd2: '',
    firstName: '',
    lastName: '',
    code: '',
    number: '',
    confirm: false,
    image: '',
    codeId: '',
    isCode: true,
  }),
  computed: {
    ...mapGetters(['getCode'])
  },
  methods: {
    ...mapActions('auth/api', ['register']),
    async submitHandler() {
      const { email, passwd1, passwd2, firstName, lastName } = this
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }
      try {
        await this.register({ email, passwd1, passwd2, firstName, lastName, code: this.number, captcha_id: this.codeId })
        this.$router.push({ name: 'RegisterSuccess' })
      } catch(e){
        this.getCodeCapt()
        this.isCode = false
        }
      
    },
    getCodeCapt() {
      axios({
        url: `account/register`,
        method: 'GET'
      }).then(response => {
        this.image = `data:image/png;base64,${response.data.image}`;
        this.codeId = response.data.id;
      }).catch(error => {})
    },
  },
  // mounted() {
  //   this.code = this.getCode
  // },
  created() {
    this.getCodeCapt(this.image);
  },
  validations: {
    confirm: { sameAs: sameAs(() => true) },
    email: { required, email },
    passwd1: { required, minLength: minLength(8) },
    passwd2: { required, minLength: minLength(8), sameAsPassword: sameAs('passwd1') },
    firstName: { required, minLength: minLength(3) },
    lastName: { required, minLength: minLength(3) },
    number: { required, minLength: minLength(1), isCode: false }
  }
}
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl';

.registration {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.capch {
  margin-bottom: 50px
}

.registration__action {
  margin-top: 40px;

  @media (max-width: breakpoint-xxl) {
    margin-top: 20px;
  }
}
</style>
