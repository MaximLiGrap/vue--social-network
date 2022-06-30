import axios from 'axios'

export default {
  namespaced: true,
  actions: {
    async apiBlockUser({
      dispatch
    }, id) {
      await axios({
        url: `users/block/${id}`,
        method: 'PUT'
      }).then(response => {
        dispatch('global/alert/setAlert', {
          status: 'success',
          text: 'Пользователь заблокирован'
        }, {
          root: true
        })
        dispatch('profile/friends/apiFriends', null, {
          root: true
        })
      }).catch(error => {})
    },
    async apiUnblockUser({
      dispatch
    }, id) {
      await axios({
        url: `users/block/${id}`,
        method: 'DELETE'
      }).then(response => {
        dispatch('global/alert/setAlert', {
          status: 'success',
          text: 'Пользователь разблокирован'
        }, {
          root: true
        })
        dispatch('profile/friends/apiFriends', null, {
          root: true
        })
        console.log("TCL: apiUnblockUser -> response", response)
      }).catch(error => {})
    }
  }
}
