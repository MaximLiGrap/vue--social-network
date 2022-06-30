<template lang="pug">
  .im
    .im__dialogs
      im-dialog(v-for="dialog in dialogs"
      :key="dialog.id"
      :info="dialog"
      :push="countPush(dialog.unread_count)"
      :me="dialog.last_message.isSentByMe"
      :active="activeDialog && dialog.id === activeDialog.id"
      :online="checkOnlineUser(dialog.last_message.recipient.last_online_time)"
      @click.native="clickOnDialog(dialog.id)")
    .im__chat(v-if="activeDialog")
      im-chat(:info="activeDialog" :messages="messages"
      :online="checkOnlineUser(activeDialog.last_message.recipient.last_online_time)" )
</template>

<script>
import moment from 'moment'
import { mapGetters, mapActions,} from 'vuex'
import ImDialog from '@/components/Im/Dialog'
import ImChat from '@/components/Im/Chat'

export default {
  name: 'Im',
  components: { ImDialog, ImChat },
  // data: () => ({
  //   intervalForMessages: null
  // }),
  computed: {
    ...mapGetters('profile/dialogs', ['messages', 'activeDialog', 'dialogs']),
  },
  methods: {
    ...mapActions('profile/dialogs', [
      'loadFreshMessages',
      'switchDialog',
      'closeDialog',
      'createDialogWithUser',
      'apiLoadAllDialogs',
      'disconnect',
      'writeMessage'
    ]),

    countPush(unread) {
      return unread > 0 ? unread : null
    },
    checkOnlineUser(time) {
      return moment().diff(moment(time), 'seconds') <= 60
    },
    clickOnDialog(dialogId) {
      this.$router.push({ name: 'Im', query: { activeDialog: dialogId } })
    },
    async selectDialogByRoute(route, vm) {
      if (route.query.activeDialog) {
        vm.switchDialog(route.query.activeDialog)
      } else if (route.query.userId) {
        vm.createDialogWithUser(route.query.userId)
      } else if (vm.dialogs.length > 0) {
        vm.$router.push({ name: 'Im', query: { activeDialog: vm.dialogs[0].id } })
      } else {
        await vm.apiLoadAllDialogs()
        if (vm.dialogs.length > 0) {
          vm.$router.push({ name: 'Im', query: { activeDialog: vm.dialogs[0].id } })
        }
        console.log('No dialogs at all')
      }
    }
  },

  beforeRouteEnter(to, from, next) {
    next(async vm => {
      vm.selectDialogByRoute(to, vm)
    })
  },
  beforeRouteUpdate(to, from, next) {
    if(this.activeDialog) {
      this.writeMessage({recipient_id: this.activeDialog.recipient.id, dialog_id: this.activeDialog.id, message_text: 0})
    }
    this.selectDialogByRoute(to, this)
    
    this.disconnect()
    
    next()
  },
  beforeDestroy() {
    this.closeDialog()
    this.disconnect()
  }
}
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl';

.im {
  display: flex;
  height: 'calc(100vh - %s)' % header-height;
}

.im__dialogs {
  width: 100%;
  max-width: 39.13%;
  overflow-y: auto;
  max-height: 100%;
  height: 100%;
  background-color: #F2F5F9;

  @media (max-width: breakpoint-xl) {
    max-width: 120px;
  }
}

.im__chat {
  width: 100%;
  flex: auto;
  height: 100%;
  background-color: #F8FAFD;
}
</style>
