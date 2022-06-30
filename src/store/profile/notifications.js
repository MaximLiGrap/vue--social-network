import axios from 'axios'
import router from '@/router'

export default {
  namespaced: true,
  state: {
    notifications: []
  },
  getters: {
    getNotifications: s => s.notifications,
    getNotificationsLength: s => s.notifications.length, 
    getNotificationsTextType: s => type => {
      switch (type) {
        case 'POST':
          return 'опубликовал новую запись'
        case 'POST_COMMENT':
          return 'оставил комментарий'
        case 'COMMENT_COMMENT':
          return 'ответил на ваш комментарий'
        case 'FRIEND_REQUEST':
          return 'добавил в друзья нового пользователя'
        case 'FRIEND_BIRTHDAY':
          return 'день рождение'
        case 'MESSAGE':
          return 'прислал сообщение'
      }
    }
  },
  mutations: {
    setNotifications: (s, value) => s.notifications = value,
    routePushWithQuery(state, type) {
      router.push({
        name: 'Push',
        query: {name: type},
      })
    },
  },
  actions: {
    async apiNotifications({
      commit,
      dispatch,
      state
    }) {
      await axios({
        url: 'notifications',
        method: 'GET'
      }).then(response => { 
        if (`${response.data.data.map(z => z.sent_time)}` !== `${state.notifications.map(z => z.sent_time)}`) {
          commit('setNotifications', response.data.data)
        }
        // setTimeout(() => {
        //   dispatch('apiNotifications')
        // }, 5000)
      }).catch(() => {})
    },
    async readNotifications() {
      await axios({
        url: 'notifications?id=0&all=true',
        method: 'PUT'
      }).then(response => {}).catch(() => {})
    },
    async readNotification({state, commit}, info) {
      await  axios({
        url: `notifications`,
        method: 'PUT',
        params: {
          id: info.id,
          all: false,
        }
      }).then(response => { commit('routePushWithQuery', info.event_type)}).catch(() => {})
    }
  }
}
