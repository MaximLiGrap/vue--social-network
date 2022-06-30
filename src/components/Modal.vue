<template lang="pug">
  transition(name="fade")
    .modal(v-show="isDisplay" tabindex="-1" @click.self="close" @keyup.esc="close" ref="modal")
      .modal__wrapper
        .modal__body
          slot
        .modal__actions
          slot(name="actions")
</template>

<script>
export default {
  name: 'Modal',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isDisplay() {
      return this.value
    },
    scrollBarWidth() {
      return window.innerWidth - document.documentElement.clientWidth
    }
  },
  watch: {
    value() {
      setTimeout(() => {
        this.$emit(this.value ? 'onOpen' : 'onClose')
      }, this.DELAY_EFFECT)
      if (this.value) {
        this.setScrollPadding()
        document.body.classList.add('overflow-hidden')
      } else {
        setTimeout(() => {
          this.removeScrollPadding()
          document.body.classList.remove('overflow-hidden')
        }, this.DELAY_EFFECT)
      }
    }
  },
  created() {
    this.DELAY_EFFECT = 300
  },
  methods: {
    close() {
      this.$emit('input', false)
    },
    checkBodyOverflowing() {
      const rect = document.body.getBoundingClientRect()
      return rect.left + rect.right < window.innerWidth
    },
    setScrollPadding() {
      this.isBodyOverflowing = this.checkBodyOverflowing()
      if (this.isBodyOverflowing) {
        document.body.style.paddingRight = `${this.scrollBarWidth}px`
      }
    },
    removeScrollPadding() {
      document.body.style.paddingRight = 0
    }
  }
}
</script>