<template lang="pug">
  .main-layout__sidebar
    .main-layout__logo(:class="{admin: isAdminPage}")
      simple-svg(:filepath="'/static/img/logo.svg'")
      .main-layout__admin-logo(v-if="isAdminPage")
        simple-svg(:filepath="'/static/img/logo-admin.svg'")
    nav.main-layout__nav
      router-link.main-layout__link(v-for="(item,index) in info" :key="index" :exact="item.exact" :to="item.link" :class="{'main-layout__link--im': item.link.name === 'Im', 'big': unreadedMessages >= 100}" :data-push="item.link.name === 'Im' ? unreadedMessages : false")
        img(:src="`/static/img/sidebar/admin/${item.icon}.png`" :alt="item.text" v-if="isAdminPage")
        simple-svg(:filepath="`/static/img/sidebar/${item.icon}.svg`" v-else)
        span {{item.text}}
    router-link.main-layout__link(v-if="!isAdminPage" :to="{name: 'Settings'}")
      simple-svg(:filepath="'/static/img/sidebar/settings.svg'")
      span Настройки
    a.main-layout__link(@click.prvent="onLogout" href="#")
      simple-svg(:filepath="'/static/img/sidebar/exit.svg'")
      span Выйти
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'MainLayoutSidebar',
  computed: {
    ...mapGetters('global/menu', ['getSidebarById']),
    ...mapGetters('profile/dialogs', ['unreadedMessages']),
    isAdminPage() {
      return this.$route.path.indexOf('admin') !== -1
    },
    info() {
      return this.getSidebarById(this.isAdminPage ? 'admin' : 'user')
    }
  },
  methods: {
    ...mapActions('auth/api', ['logout']),
    ...mapActions('profile/dialogs', ['apiUnreadedMessages']),
    onLogout() {
      this.logout().then(() => {
        this.$router.push({ name: 'Login' })
      })
    }
  },
  mounted() {
    this.apiUnreadedMessages()
  }
}
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl';

.main-layout__sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: sidebar-width;
  background: steel-gray;
  padding: 40px;
  color: #fff;
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  @media (max-width: breakpoint-xxl) {
    width: sidebar-width-xl;
  }
}

.main-layout__logo {
  max-width: 85px;
  margin-bottom: 100px;
  display: flex;
  align-items: center;

  &.admin {
    max-width: 100%;
  }

  .simple-svg-wrapper {
    width: 100%;
  }
}

.main-layout__admin-logo {
  width: 100%;
  margin-left: 10px;
}

.main-layout__nav {
  margin-bottom: auto;
  margin-top: -25px;
}

.main-layout__link {
  color: rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  margin-left: -25px;
  margin-right: -25px;
  padding: 25px;
  transition: all 0.2s;
  position: relative;

  &:hover {
    color: #fff;

    .simple-svg, img {
      opacity: 1;
    }
  }

  &--im {
    &:after {
      content: attr(data-push);
      font-weight: 600;
      font-size: 13px;
      width: 23px;
      height: 23px;
      background-color: #E65151;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
    }

    &.big {
      &:after {
        width: 35px;
        height: 35px;
        right: 5px;
      }
    }

    .simple-svg {
      fill: #fff;
    }
  }

  &.router-link-active {
    color: #fff;

    .simple-svg, img {
      opacity: 1;
    }
  }

  .simple-svg-wrapper, img {
    width: 15px;
    height: 15px;
    margin-right: 15px;
    flex: none;
  }

  .simple-svg, img {
    opacity: 0.4;
    transition: all 0.2s;
  }
}
</style>
