<template lang="pug">
  header.main-layout__header(:class="{admin: isAdminPage}")
    template(v-if="!isAdminPage")
      form.main-layout__search(action="#" @submit.prevent="onSearch")
        button.main-layout__search-btn
          simple-svg(:filepath="'/static/img/search.svg'")
        input.main-layout__search-input(type="text" placeholder="Поиск" :value="searchText" @input="setSearchText($event.target.value)")
      .main-layout__push(@click="togglePush")
        simple-svg(:filepath="'/static/img/push.svg'" :data-push="getNotificationsLength > 0 ? getNotificationsLength : false")
        push(:isOpen="isOpenPush" @close-push="togglePush")
    router-link.main-layout__user(v-if="getInfo" :to="{name: 'Profile'}")
      .main-layout__user-pic
        img(:src="getInfo.photo" :alt="getInfo.fullName")
      span.main-layout__user-name {{getInfo.fullName}}
      span.main-layout__user-post(v-if="isAdminPage") - администратор
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import Push from '@/components/MainLayout/Push'
export default {
  name: 'MainLayoutHeader',
  components: { Push },
  data: () => ({
    isOpenPush: false
  }),
  computed: {
    ...mapGetters('global/search', ['searchText']),
    ...mapGetters('profile/info', ['getInfo']),
    ...mapGetters('profile/notifications', ['getNotificationsLength', 'getNotifications']),
    isAdminPage() {
      return this.$route.path.indexOf('admin') !== -1
    }
  },
  methods: {
    ...mapMutations('global/search', ['setSearchText']),
    ...mapActions('profile/info', ['apiInfo']),
    ...mapActions('global/search', ['searchAll']),
    onSearch() {
      this.searchAll(this.searchText).then(() => {
        this.$router.push({ name: 'Search', query: { text: this.searchText } })
      })
    },
    togglePush() {
      this.isOpenPush = !this.isOpenPush
    }
  },
  mounted() {
    if (!this.getInfo) this.apiInfo()
    console.log(this.getNotifications)
  }
}
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl';

.main-layout__header {
  background: eucalypt;
  box-shadow: standart-boxshadow;
  height: header-height;
  position: fixed;
  top: 0;
  left: sidebar-width;
  right: 0;
  display: flex;
  align-items: center;
  padding: 0 40px;
  z-index: 10;
  color: #FFFFFF;

  &.admin {
    background: #fff;
    color: steel-gray;
    justify-content: flex-end;
  }

  @media (max-width: breakpoint-xxl) {
    left: sidebar-width-xl;
  }
}

.main-layout__search {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 350px;
  margin-right: auto;
}

.main-layout__search-btn {
  margin-right: 10px;
  background-color: transparent;
  outline: none;

  .simple-svg-wrapper {
    width: 16px;
    height: 16px;
  }

  .simple-svg {
    stroke: #fff;
    fill: transparent;
  }
}

.main-layout__search-input {
  font-size: 15px;
  width: 100%;
  background: transparent;
  padding: 5px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.12);
  color: #fff;
  transition: all 0.2s;

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }

  &:focus {
    border-bottom-color: #fff;
  }
}

.main-layout__push {
  margin-right: 30px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  .simple-svg-wrapper {
    width: 17px;
    height: 17px;
    position: relative;

    &[data-push]:after {
      content: attr(data-push);
      font-style: normal;
      font-weight: bold;
      font-size: 10px;
      line-height: 15px;
      width: 16px;
      height: 16px;
      background-color: #F9555F;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      top: -25px;
      left: 7px;
      padding-right: 1px;
    }
  }
}

.main-layout__user {
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 15px;
  color: #fff;
}

.main-layout__user-pic {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 15px;
  flex: none;

  img {
    width: 100%;
  }
}

.main-layout__user-post {
  margin-left: 5px;
}
</style>
