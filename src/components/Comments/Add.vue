<template lang="pug">
  form.comment-add(action="#" @submit.prevent="onSubmitComment")
    .comment-add__pic(v-if="getInfo")
      img(:src="getInfo.photo" :alt="getInfo.fullName")
    input.comment-add__input(type="text" placeholder="Написать комментарий..." ref="addInput" v-model="commentText")
    //- .comment-add__icon.photo
    //-   simple-svg(:filepath="'/static/img/photo.svg'")
    //- .comment-add__icon.add
    //-   simple-svg(:filepath="'/static/img/add.svg'")
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'CommentAdd',
    data: () => ({
    photo: null,
    src: '',
  }),
  props: {
    value: String,
    id: [Number, String],
    parentId: Number,
  },
  computed: {
    ...mapGetters('profile/info', ['getInfo']),
    commentText: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    }
  },
  methods: {
    onSubmitComment() {
      this.$emit('submited')
    },
  }
}
</script>

<style lang="stylus">
.comment-add {
  display: flex;
  align-items: center;
  height: 60px;
  border-top: 1px solid #e7e7e7;
  margin-top: 20px;
}

.comment-add__pic {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 15px;

  img {
    width: 100%;
  }
}

.comment-add__input {
  font-size: 13px;
  line-height: 21px;
  color: #6A6A80;
  display: block;
  width: 100%;

  &::placeholder {
    color: #B0B0BC;
  }
}

.comment-add__icon {
  cursor: pointer;

  &+& {
    margin-left: 10px;
  }

  &.photo {
    .simple-svg-wrapper {
      width: 22px;
      height: 22px;
    }
  }

  &.add {
    margin-top: -5px;

    .simple-svg-wrapper {
      width: 15px;
      height: 15px;
    }
  }
}
</style>
