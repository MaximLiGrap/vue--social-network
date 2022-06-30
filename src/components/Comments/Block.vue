<template lang="pug">
  .comment-block(:class="{'show-comments': isShowSubComments}")
    template(v-if="admin")
      .edit(v-tooltip.bottom="'Разблокировать'" v-if="blocked")
        simple-svg(:filepath="'/static/img/unblocked.svg'")
      .edit(v-tooltip.bottom="'Заблокировать'" v-else)
        simple-svg(:filepath="'/static/img/blocked.svg'")
    comment-main(
      :admin="admin" 
      :info="info" 
      :edit="edit" 
      :deleted="deleted" 
      @answer-comment="onAnswerMain" 
      @edit-comment="onEditMain"
      @delete-comment="onDeleteComment"
      @recover-comment="onRecoverComment"
    )
    .comment-block__reviews(v-if="!info.is_deleted")
      a.comment-block__reviews-show(href="#" v-if="!isShowSubComments && info.sub_comments.length > 0" @click.prevent="showSubComments") показать {{info.sub_comments.length}} {{answerText}}
      .comment-block__reviews-list(v-else)
        comment-main(
          :admin="admin" 
          v-for="i in info.sub_comments" 
          :key="i.id" 
          :info="i"  
          :edit="getInfo.id === i.author.id" 
          :deleted="getInfo.id === i.author.id"  
          @answer-comment="onAnswerSub" 
          @edit-comment="onEditSub"
          @delete-comment="onDeleteComment"
          @recover-comment="onRecoverComment"
        )
        comment-add(
          v-if="!admin" 
          ref="addComment" 
          :id="info.post_id" 
          :parent-id="info.parent_id"  
          v-model="commentText" 
          @submited="onSubmitComment"
        )
</template>

<script>
import CommentMain from '@/components/Comments/Main'
import CommentAdd from '@/components/Comments/Add'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'CommentBlock',
  props: {
    admin: Boolean,
    blocked: Boolean,
    info: Object,
    edit: Boolean,
    deleted: Boolean
  },
  components: { CommentMain, CommentAdd },
  data: () => ({
    isShowSubComments: false,
    commentText: '',
    commentEdit: false,
    commentEditId: null,
    commentEditParentId: null
  }),
  computed: {
    ...mapGetters('profile/info', ['getInfo']),
    answerText() {
      if (!this.info) return 'ответ'
      return this.info.sub_comments.length > 1 ? 'ответа' : 'ответ'
    }
  },
  methods: {
    ...mapActions('profile/comments', ['commentActions', 'deleteComment', 'recoverComment']),
    showSubComments() {
      this.isShowSubComments = true
    },
    onAnswerSub() {
      this.$refs.addComment.$refs.addInput.focus()
    },
    onAnswerMain() {
      this.showSubComments()
      this.$nextTick(() => this.onAnswerSub())
    },
    onEditMain({ commentText }) {
      this.$emit('edit-comment', {
        commentInfo: this.info,
        commentText
      })
    },
    onDeleteComment(id) {
      this.deleteComment({
        id,
        post_id: this.info.post_id
      })
    },
    onRecoverComment(id) {
      this.recoverComment({
        id,
        post_id: this.info.post_id
      })
    },
    onEditSub({ parentId, id, commentText }) {
      this.commentEdit = true
      this.commentText = commentText
      this.commentEditId = id
      this.commentEditParentId = parentId
      this.onAnswerSub()
    },
    onSubmitComment() {
      this.commentActions({
        edit: this.commentEdit,
        post_id: this.info.post_id,
        parent_id: this.commentEdit ? this.commentEditParentId : this.info.id,
        text: this.commentText,
        id: this.commentEditId
      }).then(() => {
        this.commentText = ''
        this.commentEdit = false
        this.commentEditInfo = null
        this.commentEditParentId = null
      })
    }
  }
}
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl';

.comment-block {
  padding-top: 20px;
  position: relative;

  &:after {
    content: '';
    display: none;
    height: 1px;
    width: calc(100% - 50px);
    background-color: #e7e7e7;
    position: absolute;
    top: 0;
    right: 0;
  }

  &+& {
    margin-top: 20px;

    &:after {
      display: block;
    }
  }

  &.show-comments {
    & + .comment-block {
      margin-top: 0;

      &:after {
        width: 100%;
      }
    }

    .comment-block__reviews {
      border-top: 1px solid #e7e7e7;
      padding-top: 40px;
    }
  }

  .comment-add {
    height: 50px;
  }
}

.comment-block__reviews {
  margin-top: 15px;
  max-width: calc(100% - 50px);
  margin-left: auto;
}

.comment-block__reviews-show {
  color: eucalypt;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;

  &:before {
    content: '';
    display: block;
    width: 7px;
    height: 7px;
    margin-right: 7px;
    border: 1.5px solid transparent;
    border-radius: 2px;
    border-top-color: eucalypt;
    border-right-color: eucalypt;
    transform: rotate(45deg);
  }
}

.comment-block__reviews-list {
  .comment-main + .comment-main {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #e7e7e7;
  }

  .comment-main__pic {
    width: 30px;
    height: 30px;
  }
}
</style>
