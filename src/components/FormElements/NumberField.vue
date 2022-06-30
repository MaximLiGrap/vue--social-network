<template lang="pug">
  .form__group(:class="{fill: number.length > 0}")
    input.form__input(:id="id" v-model="number" name="number" :class="{invalid: (!isCode)}" @change="v.$touch()")
    label.form__label(:for="id") Код с картинки
    span.form__error(v-if="v.$dirty && !v.required") Обязательно поле 
    span.form__error(v-else-if="!isCode") Код не совпадает
</template>

<script>
export default {
  name: 'NumberField',
  props: {
    value: {
      type: String,
      default: ''
    },
    v: {
      type: Object,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    isCode: Boolean,
  },
  computed: {
    number: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    }
  }
}
</script>

