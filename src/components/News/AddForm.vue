<template lang="pug">
  .news-add-form
    form.news-add__main(action="#" @submit.prevent="" ref="form")
      .news-add__text
        input.news-add__text-title(type="text" placeholder="Дайте тему" v-model="title")
        editor-content.news-add__text-main(:editor="editor")
        editor-menu-bar.news-add__actions(:editor="editor" v-slot="{ commands, isActive, getMarkAttrs, menu }" @mouseleave.native="hideLinkMenu")
          .news-add__actions-buttons
            button.bold(:class="{ 'is-active': isActive.bold() }" @click="commands.bold") ж
            button.italic(:class="{ 'is-active': isActive.italic() }" @click="commands.italic") к
            button.underline(:class="{ 'is-active': isActive.underline() }" @click="commands.underline") ч
            .news-add__actions-link
              .news-add__actions-link-hidden(:class="{'is-active': isOpenLinkMenu}")
                form(@submit.prevent="setLinkUrl(commands.link, linkUrl)")
                  input(type="text" v-model="linkUrl" placeholder="https://" ref="linkInput" @keydown.esc="hideLinkMenu")
                  button(type="button" @click="setLinkUrl(commands.link, linkUrl)")
                    simple-svg(:filepath="'/static/img/add.svg'")
              button.link(:class="{ 'is-active': isActive.link() }" @click="openLinkMenu(getMarkAttrs('link'))")
                simple-svg(:filepath="'/static/img/link.svg'")
      .news-add__settings
        h4.news-add__settings-title Настройка публикации
        add-tags(:tags="tags" @change-tags="onChangeTags")
        button-hover.news-add__planning(variant="white" bordered @click.native="openModal" v-if="!edit || deffered") Запланировать
        button-hover(@click.native="submitForm") Опубликовать
    modal.news-add__modal(v-model="modalShow")
      v-date-picker(v-model="planingTime" @input="onChangeDatePicker" title-position="left" :min-date='new Date()' is-inline :attributes='attrs' :key="componentKey")
      .news-add__modal-selects
        select.select.news-add__modal-select.day(v-model="day" @change="changeDate")
          option(v-for="d in days" :key="d") {{d}}
        select.select.news-add__modal-select.month(v-model="month" @change="changeDate")
          option(v-for="month in months" :key="month.val" :value="month") {{month.text}}
        select.select.news-add__modal-select.year(v-model="year" @change="changeDate")
          option(v-for="i in years" :key="i") {{i}}
        select.select.news-add__modal-select.time(v-model="time")
          option(v-for="t in times" :key="t") {{t}}
        select.select.news-add__modal-select.time(v-model="min")
          option(v-for="m in mins" :key="m") {{m}}
      template(slot="actions")
        button-hover(@click.native="onPlaning") Планировать
        button-hover(variant="red" bordered @click.native="closeModal") Отмена
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import { Bold, Italic, Underline, Link } from 'tiptap-extensions'
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'
import AddTags from '@/components/News/AddTags'
import Modal from '@/components/Modal'
export default {
  name: 'NewsAddForm',
  props: {
    edit: Boolean,
    deffered: Boolean,
    info: Object
  },
  components: { AddTags, EditorContent, EditorMenuBar, Modal },
  data: () => ({
    title: '',
    tags: [],
    editor: null,
    linkUrl: '',
    isOpenLinkMenu: false,
    modalShow: false,
    isPlaning: false,
    planingTime: new Date(),
    componentKey: 0,
    attrs: [
      {
        key: 'weekends',
        content: 'weekends',
        dates: {
          start: new Date(2018, 0, 1),
          end: new Date(2022, 0, 1),
          weekdays: [1, 7]
        }
      }
    ],
    day: 1,
    month: { val: 0, text: 'Января' },
    year: 2000,
    months: [
      { val: 0, text: 'Января' },
      { val: 1, text: 'Февраля' },
      { val: 2, text: 'Марта' },
      { val: 3, text: 'Апреля' },
      { val: 4, text: 'Мая' },
      { val: 5, text: 'Июня' },
      { val: 6, text: 'Июля' },
      { val: 7, text: 'Августа' },
      { val: 8, text: 'Сентября' },
      { val: 9, text: 'Октября' },
      { val: 10, text: 'Ноября' },
      { val: 11, text: 'Декабря' }
    ],
    time: `12`,
    times: [
      '8',
      '9',
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
      '19',
      '20',
      '21',
      '22',
      '23'
    ],
    min: '00',
    mins: [
      '00',
      '01',
      '02',
      '03',
      '04',
      '05',
      '06',
      '07',
      '08',
      '09',
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
      '19',
      '21',
      '22',
      '23',
      '24',
      '25',
      '26',
      '27',
      '28',
      '29',
      '30',
      '31',
      '32',
      '33',
      '34',
      '35',
      '36',
      '37',
      '38',
      '39',
      '40',
      '41',
      '42',
      '43',
      '44',
      '45',
      '46',
      '47',
      '48',
      '49',
      '50',
      '51',
      '52',
      '53',
      '54',
      '55',
      '56',
      '57',
      '58',
      '59',
    ]
  }),
  computed: {
    ...mapGetters('profile/info', ['getInfo']),
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
  watch: {
    planingTime(val) {
      this.day = moment(val).date()
      this.month = this.months[moment(val).month()]
      this.year = moment(val).year()
    }
  },
  methods: {
    ...mapActions('profile/feeds', ['actionsFeed']),
    ...mapActions('users/info', ['apiWall']),
    onPlaning() {
      this.isPlaning = true
      this.submitForm()
      this.closeModal()
    },
    onChangeTags(tags) {
      this.tags = tags
    },
    submitForm() {
      if (this.title.length <= 5 || this.editor.getHTML().length <= 7) {
        this.modalShow && this.closeModal()
        alert('Введите тему или текст')
        return
      }
      this.actionsFeed({
        route: this.$route.name,
        post_id: this.info ? this.info.id : null,
        edit: this.edit,
        id: this.getInfo.id,
        title: this.title,
        post_text: this.editor.getHTML(),
        tags: this.tags,
        publish_date:
          this.isPlaning &&
          moment({
            years: this.year,
            months: this.month.val,
            date: this.day,
            hours: this.time,
            minutes: this.min
          }).valueOf()
      }).then(() => {
        this.$emit('submit-complete')
      })
    },
    openLinkMenu(attrs) {
      this.linkUrl = attrs.href
      this.isOpenLinkMenu = true
      this.$nextTick(() => {
        this.$refs.linkInput.focus()
      })
    },
    setLinkUrl(command, url) {
      command({ href: url })
      this.isOpenLinkMenu = false
      this.editor.focus()
    },
    hideLinkMenu() {
      this.linkUrl = null
      this.isOpenLinkMenu = false
    },
    openModal() {
      this.modalShow = true
    },
    closeModal() {
      this.modalShow = false
      this.isPlaning = false
    },
    setInfo(val) {
      this.day = moment(val).date()
      this.month = this.months[moment(val).month()]
      this.year = moment(val).year()
    },
    changeDate() {
      this.componentKey += 1
      this.planingTime = new Date(this.year, this.month.val, this.day)
    },
    onChangeDatePicker(value) {
      this.day = moment(value).date()
      this.month = this.months[moment(value).month()]
      this.year = moment(value).year()
    }
  },
  mounted() {
    if (this.edit) {
      this.title = this.info.title
      this.tags = this.info.tags
      this.editor = new Editor({
        content: `<p>${this.info.post_text}</p>`,
        extensions: [new Bold(), new Italic(), new Underline(), new Link()]
      })
      if (this.deffered) {
        this.day = moment(this.info.time).date()
        this.month = this.months[moment(this.info.time).month()]
        this.year = moment(this.info.time).year()
      }
    } else {
      this.editor = new Editor({
        content: '<p></p>',
        extensions: [new Bold(), new Italic(), new Underline(), new Link()]
      })
      this.day = moment().date()
      this.month = this.months[moment().month()]
      this.year = moment().year()
    }
  },
  beforeDestroy() {
    this.editor.destroy()
  }
}
</script>
