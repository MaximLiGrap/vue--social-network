import axios from 'axios'

export default {
  namespaced: true,
  state: {
    feeds: [],
    total: null,
  },
  getters: {
    getFeeds: s => s.feeds,
    getTotal: s => s.total
  },
  mutations: {
    deleteFeed: (s, id) => s.feeds = s.feeds.filter((item) => item.id !== id),
    setTotal: (s, total) => s.total = total,
    setFeeds: (s, feeds) => s.feeds = feeds,
    addFeeds: (s, feeds) => s.feeds =  s.feeds.concat(feeds),
    setCommentsById: (s, payload) => {
      s.feeds[s.feeds.indexOf(s.feeds.find(el => el.id === payload.post_id))].comments = payload.value
      s.feeds.push('dog-nail')
      s.feeds.splice(-1,1)
    },
    setFeedsById: (s, payload) => s.feeds[s.feeds.indexOf(s.feeds.find(el => el.id === payload.id))] = payload
  },
  actions: {
    async apiFeeds({
      commit
    }, payload) {
      let query = []
      payload && Object.keys(payload).map(el => {
        payload[el] && query.push(`${el}=${payload[el]}`)
      })
      await axios({
        url: `feeds?${query.join('&')}`,
        method: 'GET'
      }).then(response => {
        console.log("TCL: apiFeeds -> response", response)
        commit('setFeeds', response.data.data)
        commit('setTotal', response.data.total)
      }).catch(() => {})
    },
    async apiFeedsAdd({
      commit
    }, payload) {
      let query = []
      payload && Object.keys(payload).map(el => {
        payload[el] && query.push(`${el}=${payload[el]}`)
      })
      await axios({
        url: `feeds?${query.join('&')}`,
        method: 'GET'
      }).then(response => {
        console.log("TCL: apiFeeds -> response", response)
        commit('addFeeds', response.data.data)
        commit('setTotal', response.data.total)
      }).catch(() => {})
    },
    async apiFeedsById({
      commit
    }, post_id) {
      await axios({
        url: `post/${post_id}`,
        method: 'GET'
      }).then(response => {
        console.log("TCL: apiFeeds -> response", response)
        commit('setFeedsById', response.data)
      }).catch(() => {})
    },
    async actionsFeed({
      dispatch
    }, payload) {
      console.log("TCL: payload", payload)
      let url = payload.edit ? `post/${payload.post_id}` : `users/${payload.id}/wall`
      let method = payload.edit ? 'PUT' : 'POST'
      if (payload.publish_date) url += '?publish_date=' + payload.publish_date
      await axios({
        url,
        method,
        data: {
          title: payload.title,
          post_text: payload.post_text,
          tags: payload.tags
        }
      }).then(response => {
        if (payload.edit) {
          dispatch('users/info/apiWallById', payload.post_id, {
            root: true
          })
        } else {
          payload.route === 'News' ?
            dispatch('apiFeeds', {offset: '0', perPage: '20'}) :
            dispatch('users/info/apiWall', {
              id: payload.id
            }, {
              root: true
            })
        }
      }).catch(() => {})
    },
    async deleteFeeds({dispatch, state, commit}, payload) {
      await axios({
        url: `post/${payload.post_id}`,
        method: 'DELETE'
      }).then(response => {
        payload.route === 'News' ?
          commit('deleteFeed', payload.post_id) :
          commit('users/info/deleteWall', {
            id: payload.post_id
          }, {
            root: true
          })
      }).catch(() => {})
    }
  }
}
