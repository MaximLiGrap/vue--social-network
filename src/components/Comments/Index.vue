<template lang="pug">
  .comments(:class="{open: isOpenComments, 'comments--admin': admin}")
    h4.comments__title
      span Комментарии ({{commentsLength}})
      a.comments__show(@click.prevent="showComments" href="#" v-if="info.length > 1") {{showText}}
    .comments__list(v-if="getInfo")
      comment-block(
        :admin="admin" 
        v-for="i in info" 
        :key="i.id" 
        :info="i" 
        :edit="getInfo.id === i.author.id" 
        :deleted="getInfo.id === i.author.id" 
        @edit-comment="onEditMain"
      )
      .comments__add(v-if="!admin")
        comment-add(ref="addComment" :id="id" v-model="commentText" @submited="onSubmitComment")
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import CommentBlock from '@/components/Comments/Block'
import CommentAdd from '@/components/Comments/Add'
export default {
  name: 'Comments',
  props: {
    admin: Boolean,
    info: Array,
    id: Number,
    edit: Boolean,
    deleted: Boolean
  },
  components: { CommentBlock, CommentAdd },
  data: () => ({
    isOpenComments: false,
    commentText: '',
    commentEdit: false,
    commentEditInfo: null
  }),
  computed: {
    ...mapGetters('profile/info', ['getInfo']),
    showText() {
      return this.isOpenComments ? 'скрыть' : 'показать'
    },
    commentsLength() {
      let result = 0
      this.info.map(el => {
        !el.is_deleted && result++
        el.sub_comments &&
          el.sub_comments.map(subEl => {
            !subEl.is_deleted && result++
          })
      })
      return result
    }
  },
  methods: {
    ...mapActions('profile/comments', ['commentActions']),
    showComments() {
      this.isOpenComments = !this.isOpenComments
    },
    onEditMain({ commentInfo, commentText }) {
      this.commentEdit = true
      this.commentText = commentText
      this.commentEditInfo = commentInfo
      this.$refs.addComment.$refs.addInput.focus()
    },
    onSubmitComment() {
      this.commentActions({
        edit: this.commentEdit,
        post_id: this.id,
        text: this.commentText,
        id: this.commentEdit ? this.commentEditInfo.id : null
      }).then(() => {
        this.commentText = ''
        this.commentEdit = false
        this.commentEditInfo = null
      })
    }
  }
}
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl';

.comments {
  .comment-block:not(:first-child) {
    display: none;
  }

  &.open {
    .comment-block, .comment-block__reviews {
      display: block;
    }
  }

  &.comments--admin {
    padding-bottom: 40px;

    .comment-block {
      &:first-child {
        display: none;
      }

      .edit {
        display: none;
      }
    }

    &.open {
      .comment-block:first-child {
        display: block;
      }
    }
  }
}

.comments__title {
  display: flex;
  align-items: center;
  margin-bottom: 15px;

  span {
    font-family: font-exo;
    font-weight: bold;
    font-size: 15px;
    color: #000;
    display: block;
    margin-right: 5px;
  }
}

.comments__show {
  font-size: 13px;
  color: eucalypt;
}

.comments__list {
  width: 100%;
  max-width: 580px;
}
</style>
