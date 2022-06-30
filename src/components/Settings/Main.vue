<template lang="pug">
  .settings-main
    user-info-form-block(label="Имя:" placeholder="Введите имя" v-model="name" )
    user-info-form-block(label="Фамилия:" placeholder="Введите фамилию" v-model="lastName" )
    user-info-form-block(label="Телефон:" placeholder="Введите телефон" v-model="phone" phone)
    user-info-form-block(label="Страна:" placeholder="Введите страну" v-model="country")
    user-info-form-block(label="Город:" placeholder="Введите город" v-model="city")
    .user-info-form__block
      span.user-info-form__label Дата рождения:
      .user-info-form__wrap
        select.select.user-info-form__select.day(v-model="day")
          option(v-for="d in days" :key="d") {{d}}
        select.select.user-info-form__select.month(v-model="month")
          option(v-for="month in months" :key="month.val" :value="month") {{month.text}}
        select.select.user-info-form__select.year(v-model="year")
          option(v-for="i in years" :key="i") {{i}}
    .user-info-form__block.user-info-form__block--photo
      span.user-info-form__label Фотография:
      .user-info-form__wrap
        .user-info-form__photo-wrap
          input.user-info-form__input-photo(type="file" ref="photo" id="photo"  @change="processFile($event)" accept="image/*")
          label.user-info-form__input.user-info-form__input--photo(for="photo")
            span.setting-main__photo-delete(v-if="photo") {{photo.name}}
              simple-svg(:filepath="'/static/img/delete.svg'" @click.native.prevent="deletePhoto")
          button-hover(variant="fill" bordered @click.native="loadPhoto") Загрузить
        .user-info-form__photo-pic(v-if="photo && src")
          img(:src="src" :alt="photo.name")
    user-info-form-block(label="О себе:" v-model="about" about)
    .user-info-form__block.user-info-form__block--actions
      span.user-info-form__label
      .user-info-form__wrap
        button-hover(@click.native.prevent="submitHandler") Сохранить
        router-link.settings-main__back(:to="{name: 'Profile'}")
          button-hover(variant="red" bordered) Отменить
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'
import UserInfoFormBlock from '@/components/Settings/UserInfoForm/Block.vue'
export default {
  name: 'SettingsMain',
  components: { UserInfoFormBlock },
  data: () => ({
    name: '',
    lastName: '',
    phone: '',
    about: '',
    day: 1,
    month: { val: 1, text: 'Января' },
    year: 2000,
    months: [
      { val: 1, text: 'Января' },
      { val: 2, text: 'Февраля' },
      { val: 3, text: 'Марта' },
      { val: 4, text: 'Апреля' },
      { val: 5, text: 'Мая' },
      { val: 6, text: 'Июня' },
      { val: 7, text: 'Июля' },
      { val: 8, text: 'Августа' },
      { val: 9, text: 'Сентября' },
      { val: 10, text: 'Октября' },
      { val: 11, text: 'Ноября' },
      { val: 12, text: 'Декабря' }
    ],
    photo: null,
    src: '',
    country: '',
    city: ''
  }),
  computed: {
    ...mapGetters('global/storage', ['getStorage']),
    ...mapGetters('profile/info', ['getInfo']),
    phoneNumber() {
      return this.phone.replace(/\D+/g, '')
    },
    years() {
      return Array.from({ length: 60 }, (value, index) => 1970 + index)
    },
    days() {
      return this.month.val === 2
        ? this.year & 3 || (!(this.year % 25) && this.year & 15)
          ? 28
          : 29
        : 30 + ((this.month.val + (this.month.val >> 3)) & 1)
    }
  },
  methods: {
    ...mapActions('global/storage', ['apiStorage']),
    ...mapActions('profile/info', ['apiChangeInfo']),
    submitHandler() {
      if (!this.src) return
      this.apiStorage(this.photo).then(() => {
        this.apiChangeInfo({
          photo_id: this.getStorage && this.getStorage.id,
          first_name: this.name,
          last_name: this.lastName,
          birth_date: moment([this.year, this.month.val - 1, this.day]).format(),
          phone: this.phoneNumber,
          about: this.about,
          country: this.country,
          city: this.city
        })
      })
    },
    processFile(event) {
      this.photo = event.target.files[0]
      const reader = new window.FileReader()
      reader.onload = e => (this.src = e.target.result)
      reader.readAsDataURL(this.photo)
    },
    loadPhoto() {
      this.$refs.photo.click()
    },
    deletePhoto() {
      this.photo = null
      this.src = ''
    },
    setInfo() {
      this.name = this.getInfo.first_name
      this.lastName = this.getInfo.last_name
      this.src = this.getInfo.photo
      this.phone = this.getInfo.phone ? this.getInfo.phone.replace(/^[+]?[78]/, "") : "";
      if (this.getInfo.birth_date) {
        this.day = moment(this.getInfo.birth_date).date()
        this.month = this.months[moment(this.getInfo.birth_date).month()]
        this.year = moment(this.getInfo.birth_date).year()
      }
      this.about = this.getInfo.about
      this.country = this.getInfo.country
      this.city = this.getInfo.city
    }
  },
  watch: {
    getInfo(value) {
      if (!value) return
      this.setInfo()
    }
  },
  mounted() {
    if (this.getInfo) this.setInfo()
  }
}
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl';

.settings-main {
  background: #fff;
  box-shadow: standart-boxshadow;
  padding: 40px 10px 50px;

  .user-info-form__label {
    white-space: pre-wrap;
  }

  @media (max-width: breakpoint-xl) {
    padding: 40px 20px;
  }
}

.settings-main__back {
  margin-left: 20px;
}
</style>
