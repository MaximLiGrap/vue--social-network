<template lang="pug">
  .form__group
    input.form__checkbox(type="checkbox" name="confirm" v-model="confirm" :id="id" :class="{invalid: (v.$dirty && !v.sameAs)}")
    label.form__checkbox-label(:for="id") Я согласен с 
      a(href="#") полит. конф-ти 
      | и передачей 
      a(href="#") перс. данных
</template>

<script>
export default {
  name: 'ConfirmField',
  props: {
    value: {
      type: Boolean,
      default: ''
    },
    v: {
      type: Object,
      required: true
    },
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    confirm: {
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