<template lang="pug">
  .add-tags
    input.add-tags__input(type="text" placeholder="Добавить тег..." v-model="tag" ref="input" @change="addTag")
    .add-tags__block
      .add-tags__item(v-for="(tag,index) in tags" :key="index") {{'#'+tag}}
        span.add-tags__delete(@click="deleteTag(index)") &#10005;
</template>

<script>
export default {
  name: 'AddTags',
  props: {
    tags: Array
  },
  data: () => ({
    tagsComponent: [],
    tag: ''
  }),
  methods: {
    deleteTag(index) {
      this.tagsComponent.splice(index, 1)
      this.$emit('change-tags', this.tagsComponent)
    },
    addTag() {
      if (this.tag.length <= 0) return
      this.tagsComponent.push(this.tag)
      this.tag = ''
      this.$emit('change-tags', this.tagsComponent)
      setTimeout(() => {
        this.$refs.input.focus()
      }, 0)
    }
  },
  watch: {
    tags() {
      this.tagsComponent = this.tags
    }
  },
  mounted() {
    this.tagsComponent = this.tags
  }
}
</script>


<style lang="stylus">
@import '../../assets/stylus/base/vars.styl';

.add-tags__input {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  padding-bottom: 5px;
  font-size: 13px;
  color: steel-gray;
  margin-bottom: 15px;

  &::placeholder {
    color: #B0B0BC;
  }
}

.add-tags__block {
  margin: 0 -4px 10px;
  min-height: 32px;
}

.add-tags__item {
  display: inline-block;
  align-items: center;
  color: eucalypt;
  font-size: 13px;
  background-color: #F5F7FB;
  padding: 5px;
  margin: 0 5px 10px;
}

.add-tags__delete {
  margin-left: 5px;
  color: #B0B0BC;
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
}
</style>
