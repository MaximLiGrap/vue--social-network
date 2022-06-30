<template lang="pug">
  .comment-main
    template(v-if="info.is_deleted")
      p.comment-main__text Комментарий удален. 
        a(href="#" @click="onRecoverComment") Восстановить
    template(v-else)
      .edit.edit--small(v-if="edit || deleted")
        .edit__icon(v-if="deleted" @click="onDeleteComment")
          simple-svg(:filepath="'/static/img/delete-news.svg'")
        .edit__icon(v-if="edit" @click="editComment")
          simple-svg(:filepath="'/static/img/edit.svg'")
      router-link.comment-main__pic(:to="{name: 'ProfileId', params: {id: info.author.id}}")
        img(:src="info.author.photo" :alt="info.author.first_name")
      .comment-main__main
        router-link.comment-main__author(:to="{name: 'ProfileId', params: {id: info.author.id}}") {{info.author.first_name + ' ' + info.author.last_name}}
        p.comment-main__text {{info.comment_text}}
        .comment-main__actions
          span.comment-main__time {{info.time | moment('from') }}
          template(v-if="!admin")
            a.comment-main__review(href="#" @click.prevent="$emit('answer-comment')") Ответить
            like-comment(fill :active="info.my_like" :id="info.id + 100000000" @liked="likeAction" )
</template>

<script>
import { mapActions } from 'vuex'
import LikeComment from '@/components/LikeComment'
export default {
  name: 'CommentMain',
  props: {
    admin: Boolean,
    info: Object,
    edit: Boolean,
    deleted: Boolean
  },
  components: { LikeComment },
  methods: {
    ...mapActions('global/likes', ['putLike', 'deleteLike']),
    likeAction(active) {
      active
        ? this.deleteLike({ item_id: this.info.id, post_id: this.info.post_id, type: 'Comment' })
        : this.putLike({ item_id: this.info.id, post_id: this.info.post_id, type: 'Comment' })
    },
    onDeleteComment() {
      this.$emit('delete-comment', this.info.id)
    },
    editComment() {
      this.$emit('edit-comment', {
        id: this.info.id,
        commentText: this.info.comment_text,
        parentId: this.info.parent_id
      })
    },
    onRecoverComment() {
      this.$emit('recover-comment', this.info.id)
    }
  }
}
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl';

.comment-main {
  display: flex;
  font-size: 13px;
  position: relative;
}

.comment-main__pic {
  flex: none;
  align-self: flex-start;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 10px;

  img {
    width: 100%;
  }
}

.comment-main__main {
  width: 100%;
}

.comment-main__author {
  font-weight: 600;
  color: #000;
  margin-bottom: 5px;
  display: block;
}

.comment-main__text {
  line-height: 21px;
  color: #6A6A80;
  margin-bottom: 5px;
}

.comment-main__actions {
  display: flex;
  align-items: center;
}

.comment-main__time {
  color: santas-gray;
  display: block;
  margin-right: 20px;
}

.comment-main__review {
  color: eucalypt;
  margin-right: auto;
}
</style>
