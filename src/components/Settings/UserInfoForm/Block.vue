<template lang="pug">
  .user-info-form__block
    span.user-info-form__label {{label}}
    .user-info-form__wrap
      textarea.user-info-form__input.user-info-form__input--textarea(:value="value" @input="$emit('input', $event.target.value)" v-if="about")
      input.user-info-form__input(type="text" :value="value" :placeholder="placeholder" @input="$emit('input', $event.target.value)" :ref="phone && 'phone'" v-else)
</template>

<script>
import Inputmask from 'inputmask'
export default {
  name: 'UserInfoFormBlock',
  props: {
    label: String,
    placeholder: String,
    value: String,
    phone: Boolean,
    about: Boolean
  },
  mounted() {
    if (this.phone) {
      var im = new Inputmask('+7 (999) 999-99-99')
      im.mask(this.$refs.phone)
    }
  }
}
</script>