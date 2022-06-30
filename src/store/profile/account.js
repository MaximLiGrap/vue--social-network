import axios from 'axios'

export default {
  namespaced: true,
  state: {
    notifications: [{
        icon: 'comments',
        name: 'О новых комментариях к моим публикациям',
        type: 'POST_COMMENT',
        enable: false
      },
      {
        icon: 'reviews',
        name: 'О ответах на мои комментарии',
        type: 'COMMENT_COMMENT',
        enable: false
      },
      {
        icon: 'friends',
        name: 'О заявках в дузья',
        type: 'FRIEND_REQUEST',
        enable: false
      },
      {
        icon: 'messages',
        name: 'О новых личных сообщениях',
        type: 'MESSAGE',
        enable: false
      },
      {
        icon: 'birthdays',
        name: 'О дне рождения друга',
        type: 'FRIEND_BIRTHDAY',
        enable: false
      },
      {
        icon: 'post',
        name: 'О новых постах',
        type: 'POST',
        enable: false
      }
    ],
  },
  getters: {
    getNotificationsSettings: s => s.notifications
  },
  mutations: {
    setNotificationsSettings: (s, notifications) => s.notifications.map(el => el.enable = notifications.find(n => n.type === el.type).enable)
  },
  actions: {
    async passwordRecovery({}, email) {
      await axios({
        url: 'account/password/recovery',
        method: 'PUT',
        data: email
      }).then(response => {}).catch(error => {})
    },
    async passwordSet({
      rootState
    }, data) {
      let paramsString = document.location.search; // ?page=4&limit=10&sortby=desc  
      let searchParams = new URLSearchParams(paramsString);
      await axios({
        url: 'account/password/set',
        method: 'PUT',
        data
      }).then(response => {}).catch(error => {})
    },
    async changeEmail({}, data) {
      await axios({
        url: 'account/email/recovery',
        method: 'PUT',
        data
      }).then(response => {}).catch(error => {})
    },
    async changeEmailSet({}, data) {
      await axios({
        url: 'account/email',
        method: 'PUT',
        data
      }).then(response => {}).catch(error => {})
    },
    changeNotifications({
      dispatch
    }, data) {
      axios({
        url: 'account/notifications',
        method: 'PUT',
        data
      }).then(response => {
        dispatch('global/alert/setAlert', {
          status: 'success',
          text: 'Настройки уведомления изменены'
        }, {
          root: true
        })
        dispatch('apiNotificationsSettings')
      }).catch(error => {})
    },
    async apiNotificationsSettings({
      commit
    }) {
      await axios({
        url: 'account/notifications',
        method: 'GET'
      }).then(response => {
        commit('setNotificationsSettings', response.data.data)
      }).catch(error => {})
    }
  }
}
