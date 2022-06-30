<template lang="pug">
  .form-layout__footer
    a.form-layout__footer-support(href="#") Поддержка
    .form-layout__footer-language Язык: 
      span.active(@click="toggleLanguageBlock") {{getActiveLanguage}}
    span.form-layout__footer-copyright © Copyright {{year}} ZERONE
</template>


<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'FormLayoutFooter',
  computed: {
    ...mapGetters('auth/languages', ['getActiveLanguage']),
    year() {
      let date = new Date()
      return date.getFullYear()
    }
  },
  methods: {
    ...mapMutations('auth/languages', ['setActiveLanguage', 'toggleLanguageBlock'])
  }
}
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl';

.form-layout__footer {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  color: gun-powder;
  font-size: 13px;
  line-height: 18px;
}

.form-layout__footer-support {
  color: comet;
  margin-right: 8.3%;
}

.form-layout__footer-language {
  margin-right: 5.8%;

  .active {
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      color: #fff;
    }
  }
}
</style>
