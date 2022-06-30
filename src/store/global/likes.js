import axios from 'axios'
import router from '@/router'

export default {
  namespaced: true,
  actions: {
    async putLike({ dispatch }, data) {
      console.log("TCL: putLike -> data", data)
      await axios({
        url: 'likes',
        method: 'PUT',
        data
      }).then(response => {
        dispatch('likeAction', data)
      }).catch(error => {})
    },
    async deleteLike({
      dispatch
    }, data) {
      console.log("TCL: deleteLike -> data", data)
      await axios({
        url: `likes?item_id=${data.item_id}&type=${data.type}`,
        method: 'DELETE',
        data
      }).then(response => {
        dispatch('likeAction', data)
      }).catch(error => {})
    },
    async likeAction({ dispatch }, data) {
      if (data.type === 'Post') {
        router.history.current.name === 'News' 
          ? dispatch('profile/feeds/apiFeedsById', data.item_id, {
            root: true
          }) 
          : dispatch('users/info/apiWallById', data.item_id, {
            root: true
          }) 
      } else {
        dispatch('profile/comments/commentsById', data.post_id, {
          root: true
        })
      }
    }
  }
}
