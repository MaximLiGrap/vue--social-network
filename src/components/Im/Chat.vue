<template lang="pug">
  .im-chat
    .im-chat__user
      router-link.im-chat__user-pic(:to="{name: 'ProfileId', params: {id: info.last_message.recipient.id}}")
        img(:src="info.last_message.recipient.photo" :alt="info.last_message.recipient.first_name")
      router-link.im-chat__user-name(:to="{name: 'ProfileId', params: {id: info.last_message.recipient.id}}") {{info.last_message.recipient.first_name + ' ' + info.last_message.recipient.last_name}}
      span.user-status(:class="{online}") {{statusText}}
    .im-chat__infitite_list_wrapper
      virtual-list.im-chat__infitite_list.scroll-touch(:size="60"
        :keeps="120"
        :data-key="'sid'"
        :data-sources="messagesGrouped"
        :data-component="itemComponent"
        :wrap-class="'im-chat__message'"
        :root-tag="'section'"
        @totop="onScrollToTop"
        @scroll.passive="onScroll"
        @tobottom="onScrollToBottom"
        ref="vsl"
      )
        .im-chat__loader(slot="header", v-show="fetching")
          .spinner(v-show="!isHistoryEndReached()")
          .finished(v-show="isHistoryEndReached()") Больше сообщений нет
    form.im-chat__enter(action="#" @submit.prevent="onSubmitMessage")
      span.blink(v-if="writing") {{info.last_message.recipient.first_name}} набирает сообщение ... 
      input.im-chat__enter-input(type="text" placeholder="Ваше сообщение..." v-model="mes" @blur="focused()")
</template>

<script>
import moment from 'moment'
import Vue from 'vue'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import ChatMessage from '@/components/Im/ChatMessage'
import VirtualList from 'vue-virtual-scroll-list'
import info from '../../store/auth/info'



const makeHeader = msgDate => {
  return { sid: `group-${msgDate}`, stubDate: true, date: msgDate }
}
export default {
  name: 'ImChat',
  props: {
    info: Object,
    messages: Array,
    online: Boolean
  },
  data: () => ({
    stompClient: null,
    mes: null,
    itemComponent: ChatMessage,
    isUserViewHistory: false,
    fetching: false
  }),
  mounted() {
    this.follow = true
  },
  watch: {
    messages() {
      if (this.follow) this.setVirtualListToBottom()
    },
    mes(value) {
                value ? this.writeMessage({recipient_id: this.info.recipient.id, dialog_id: this.info.id, message_text: this.mes.length,})
                 : this.writeMessage({recipient_id: this.info.recipient.id, dialog_id: this.info.id, message_text: 0,})
    },
  },
  computed: {
    writing() {
      if(this.recipientId() !== 0) {
        if(this.recipientId() === this.getInfo().id) {
          return true
        } else {
          return false
        } 
      }
      if(this.recipientId() === 0) {
        return false
      }
    },
    statusText() {
      return this.online
        ? 'Онлайн'
        : 'был в сети ' + moment(this.info.last_message.recipient.last_online_time).fromNow()
    },
    messagesGrouped() {
      let groups = []
      let headerDate = null

      for (const msg of this.messages) {
        let msgDate = moment(msg.time).format('YYYY-MM-DD')
        if (msgDate !== headerDate) {
          headerDate = msgDate
          groups.push(makeHeader(headerDate))
        }
        groups.push(msg)
      }
      return groups
    }
  },
  methods: {
    focused() {
      this.writeMessage({recipient_id: this.info.recipient.id, dialog_id: this.info.id, message_text: 0,})
    },
    onSubmitMessage() {
      const token = localStorage.getItem('user-token')
      if(this.mes.length>0) {
        this.sendMessage({id: this.info.id, message_text: this.mes, recipient: this.info.recipient, token:token})
      this.mes = ''
      }
      
    },
    ...mapActions('profile/dialogs', ['postMessage', 'loadOlderMessages', 'sendMessage', 'connect', 'disconnect', 'writeMessage', 'resetRecipientId']),
    ...mapGetters('profile/dialogs', ['isHistoryEndReached', 'recipientId','isResizeble']),
    ...mapGetters('profile/info', ['getInfo']),
    // onSubmitMessage() {
    //   this.postMessage({ id: this.info.id, message_text: this.mes })
    //   this.mes = ''
    // },

    async onScrollToTop() {
      if (this.$refs.vsl) {
        if (!this.isHistoryEndReached()) {
          let oldest = this.messagesGrouped[0]

          this.fetching = true
          await this.loadOlderMessages()
          this.setVirtualListToOffset(1)

          this.$nextTick(() => {
            let offset = 0
            for (const groupedMsg of this.messagesGrouped) {
              if (groupedMsg.sid === oldest.sid) break
              offset += this.$refs.vsl.getSize(groupedMsg.sid)
            }

            this.setVirtualListToOffset(offset)
            this.fetching = false
          })
        }
      }
    },
    onScroll() {
      this.follow = false
    },
    onScrollToBottom() {
      this.follow = true
    },
    setVirtualListToOffset(offset) {
      if (this.$refs.vsl) {
        this.$refs.vsl.scrollToOffset(offset)
      }
    },
    setVirtualListToBottom() {
      if (this.$refs.vsl) {
        this.$refs.vsl.scrollToBottom()
      }
    },
    
  },

  // destroyed() {
  //   this.disconnect()
  // }
  
}
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl';

.im-chat {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.im-chat__user {
  border-bottom: 1px solid #E3E8EE;
  display: flex;
  align-items: center;
  height: 60px;
  padding: 30px 20px;
  font-size: 13px;
  background-color: #F8FAFD;
}

.blink {
    color: #747487;
    animation: blink 2s infinite; /* Параметры анимации */
   }
   @keyframes blink {
    from { opacity: 1; /* Непрозрачный текст */ }
    to { opacity: 0.5; /* Прозрачный текст */ }
   }

.im-chat__user-pic {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 10px;
}

.im-chat__user-name {
  font-weight: 600;
  color: steel-gray;
  margin-right: auto;
}

.im-chat__user-status {
  color: #9EA4AD;

  &.online {
    color: eucalypt;
  }
}

.im-chat__infitite_list_wrapper {
  position: relative;
  flex: 1;
}

.im-chat__infitite_list {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow-y: auto;
}

.im-chat__message > div {
  padding-left: 30px;
  padding-right: 30px;
  padding: 20px;
}

.im-chat__enter {
  display: block;
  width: 100%;
}

.im-chat__enter-input {
  width: 100%;
  background-color: #fff;
  padding: 0 40px;
  font-size: 15px;
  color: steel-gray;
  height: 60px;

  &::placeholder {
    color: #B0B0BC;
  }
}


.im-chat__loader {
  padding: 1em;
  .finished {
    font-size: 14px;
    text-align: center;
    color: #bfbfbf;
  }
  .spinner {
    font-size: 10px;
    margin: 0px auto;
    text-indent: -9999em;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: #ffffff;
    background: linear-gradient(to right, eucalypt 10%, rgba(255, 255, 255, 0) 42%);
    position: relative;
    animation: load3 1.4s infinite linear;
    transform: translateZ(0);
  }
  .spinner:before {
    width: 50%;
    height: 50%;
    background: eucalypt;
    border-radius: 100% 0 0 0;
    position: absolute;
    top: 0;
    left: 0;
    content: '';
  }
  .spinner:after {
    background: #f8fafd;
    width: 75%;
    height: 75%;
    border-radius: 50%;
    content: '';
    margin: auto;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
  @-webkit-keyframes load3 {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  @keyframes load3 {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
