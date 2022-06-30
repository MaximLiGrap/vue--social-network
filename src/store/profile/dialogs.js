import axios from 'axios'
import moment from 'moment'
import { sort } from 'semver'
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
var stompClient = null;




const mergeIncomingMessages = ({ commit, state }, response) => {
  const fromServerNewFirst = response.data.data
  fromServerNewFirst.forEach(m => (m.sid = '' + m.id))
  const onlyNewMessages = fromServerNewFirst.filter(msgServer => !state.messages.some(m => m.id === msgServer.id))
  if (onlyNewMessages.length > 0) {
    commit('addMessages', { messages: onlyNewMessages, total: response.data.total })
  }
}

// const mergeIncomingMessagesWS = ({ commit, state }, response) => {
//   const fromServerNewFirst = response.body
//   fromServerNewFirst.forEach(m => (m.sid = '' + m.id))
//   const onlyNewMessages = fromServerNewFirst.filter(msgServer => !state.messages.some(m => m.id === msgServer.id))
//   if (onlyNewMessages.length > 0) {
//     commit('addMessages', { messages: onlyNewMessages, total: response.body.total })
//   }
// }


//  [msg 0] [msg 1] .... [msg 10]
//                          ^
//                          oldestLoadedId
// <-newest messages------------------------------------------------------older
export default {
  namespaced: true,
  state: {
    dialogs: [],
    unreadedMessages: 0, // total unreaded
    messages: [], // sorted oldest->newest 0 is oldest
    totalMessages: null,
    dialogsLoaded: false,
    activeId: null,
    oldLastKnownMessageId: null,
    isHistoryEndReached: false,
    authorId: 0,
    recipientId: 0,
    isResizeble : false,
  },
  getters: {
    oldestKnownMessageId: s => (s.messages.length > 0 ? s.messages[0]['id'] : null),
    dialogs: s => s.dialogs,
    activeDialog: s => s.dialogs.find(el => el.id == s.activeId),
    activeDialogId: s => s.activeId,
    dialogsLoaded: s => s.dialogsLoaded,
    unreadedMessages: s => s.unreadedMessages,
    hasOpenedDialog: s => dialogId => !!s.dialogs.find(el => el.id == dialogId),
    isHistoryEndReached: s => s.isHistoryEndReached,
    messages: s => s.messages,
    recipientId: s => s.recipientId,
  },
  mutations: {
    deleteDialogs:  (s, id) => s.dialogs = s.dialogs.filter((item) => item.id !== id),
    setUnreadedMessages: (s, unread) => (s.unreadedMessages = unread),
    setDialogs: (s, dialogs) => (s.dialogs = dialogs),
    dialogsLoaded: s => (s.dialogsLoaded = true),
    addMessages: (s, { messages, total }) => {
      s.messages = [...s.messages, ...messages]
      s.messages.sort((a, b) => a.time - b.time)
      s.total = total
    },
    getAuthor: (s, authorId) => s.authorId = authorId,
    getRecipientId: (s, recipientId) => s.recipientId = recipientId,
    resetRecipientId: s => s.recipientId = 0, 
    addNewMessag: (s, {message, id}) => {
      message.data['sid'] = `${message.data.id}`
      if(s.authorId !== 0) {
        if(message.data.author_id !== s.authorId) {
          message.data.isSentByMe = !message.data.isSentByMe
        }
      }
      
      s.messages.push(message.data)
    },
    selectDialog: (state, dialogId) => {
      state.activeId = dialogId
      state.messages = []
      state.isHistoryEndReached = false
    },
    markEndOfHistory: s => (s.isHistoryEndReached = true),
  },
  actions: {
    connect({ state, commit }, info) {
      const token = localStorage.getItem('user-token')
      const socket = new SockJS('http://195.133.201.227:8086/ws')
      stompClient = Stomp.over(socket);
      stompClient.connect({Authorization: token}, frame => {
          console.log('Connected:' + frame);
          stompClient.subscribe('/user/'+ info + '/messages', message => {
            if((JSON.parse(message.body)).dialog_id){
              commit('getRecipientId', (JSON.parse(message.body).recipient_id))
              if((JSON.parse(message.body)).message_text == 0) {
                commit('getRecipientId', 0)
              }
            } else {
              commit('addNewMessag', {message:(JSON.parse(message.body)), id: info} )
              commit('getRecipientId', 0)
            }
            
          });
        
      });
    },

    disconnect({state, commit}) {
      stompClient.disconnect();
      console.log("Disconnected");
      commit('getRecipientId', 0)
    },

    sendMessage({state, commit}, message) {
      stompClient.send("/app/messages", {}, JSON.stringify(message))  
      console.log(message.recipient.id)
      commit('getAuthor', message.recipient.id)
    },

    writeMessage({state, commit}, write) {
      stompClient.send("/app/typing", {}, JSON.stringify(write))
    },


    closeDialog({ commit }) {
      commit('selectDialog', null)
    },

    async switchDialog({ state, getters, commit, dispatch }, dialogId) {
      if (!state.dialogsLoaded) {
        await dispatch('apiLoadAllDialogs')
      }
      if (getters.hasOpenedDialog(dialogId)) {
        commit('selectDialog', dialogId)
        await dispatch('loadFreshMessages', dialogId)
      } else {
        console.log('what to do with this dialog???? ' + dialogId)
      }
    },


    async apiLoadAllDialogs({ commit }, payload) {
      let query = []
      payload &&
        Object.keys(payload).map(el => {
          payload[el] && query.push(`${el}=${payload[el]}`)
        })
      await axios({
        url: `dialogs?${query.join('&')}`,
        method: 'GET'
      })
        .then(response => {
          commit('setDialogs', response.data.data)
          commit('dialogsLoaded')
        })
        .catch(error => {
          console.error(error)
        })
    },
    async createDialogWithUser({ dispatch, commit }, userId) {
      await axios({
        url: 'dialogs',
        method: 'POST',
        data: {
          users_ids: [userId]
        }
      })
        .then(async response => {
          const dialogId = response.data.data.id
          await dispatch('apiLoadAllDialogs', dialogId)
          await dispatch('switchDialog', userId)
        })
        .catch(error => {
          console.error(error)
        })
    },
    async loadFreshMessages({ commit, state, dispatch }, id) {
      await axios({
        url: `dialogs/${id}/messages`,
        method: 'GET',
        params: {
          itemPerPage: 10
        }
      })
        .then(response => {
         
          mergeIncomingMessages({ commit, state }, response)
          dispatch('connect', id)
          if (state.chaseHistoryUnitilMessageId !== null) {
            // dispatch('')
          }
        })
        .catch(error => {
          console.error(error)
        })
    },
    async deleteDialogs({ commit, state, dispatch }, id) {
      await axios({
        url: `dialogs/${id}`,
        method: 'DELETE',
      })
        .then(response => { commit('deleteDialogs', id)
        })
        .catch(error => {
          console.error(error)
        })
    },
    async loadOlderMessages({ commit, getters, state }) {
      await axios({
        url: `dialogs/${getters.activeDialogId}/messages`,
        params: {
          fromMessageId: getters.oldestKnownMessageId,
          offset: 1,
          itemPerPage: 2
        },
        method: 'GET'
      })
        .then(response => {
          mergeIncomingMessages({ commit, state }, response)
          if (response.data.data.length == 0) {
            commit('markEndOfHistory')
          }
        })
        .catch(error => {
          console.error(error)
        })
    },
    // async postMessage({ dispatch }, payload) {
    //   await axios({
    //     url: `dialogs/${payload.id}/messages`,
    //     method: 'POST',
    //     data: {
    //       message_text: payload.message_text
    //     }
    //   })
    //     .then(response => {
    //       dispatch('loadFreshMessages', payload.id)
    //     })
    //     .catch(error => {
    //       console.error(error)
    //     })
    // },
    async apiUnreadedMessages({ commit }) {
      await axios({
        url: 'dialogs/unreaded',
        method: 'GET'
      })
        .then(response => {
          commit('setUnreadedMessages', response.data.data.count)
        })
        .catch(error => {
          console.error(error)
        })
    }
  }
}
