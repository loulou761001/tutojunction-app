export const state = () => ({
  counter: 0,
  recoUsers: null,
  categories: [],
  addImgState: 0,
  selectedImg: null,
  confPopupOpen: false,
})

export const getters = {
  isAuthenticated(state) {
    return state.auth.loggedIn
  },
  isMod(state) {
    return (
      state.auth.loggedIn &&
      (state.auth.user.role === 'moderator' || state.auth.user.role === 'admin')
    )
  },
  loggedInUser(state) {
    return state.auth.user
  },
  getCategories(state) {
    return state.categories
  },
  getRecoUsers(state) {
    return state.recoUsers
  },
  getSelectedImg(state) {
    return state.selectedImg
  },
  getAddImgState(state) {
    return state.addImgState
  },
  getConfPopupOpen(state) {
    return state.confPopupOpen
  },
}

export const mutations = {
  FILL_CATEGORIES(state, payload) {
    state.categories = payload
  },
  FILL_RECO_USERS(state, payload) {
    state.recoUsers = payload
  },
  FILL_SELECTED_IMG(state, payload) {
    state.selectedImg = payload
    state.addImgState++
  },
  SET_CONF_POPUP_OPEN(state, payload) {
    state.confPopupOpen = payload
  },
}

export const actions = {
  fillCategories: async function ({ commit, state }) {
    if (!state.categories.length) {
      await this.$axios.get('/categories').then((data) => {
        commit('FILL_CATEGORIES', data.data)
      })
    }
  },
  fillRecoUsers: function ({ commit, state }, payload) {
    commit('FILL_RECO_USERS', payload)
  },
  addImg: function ({ commit, state }, img) {
    this.$utils.consoleLog('action', img)
    commit('FILL_SELECTED_IMG', img)
  },
  setConfPopupOpen: function ({ commit, state }, payload) {
    this.$utils.consoleLog('action', payload)
    commit('SET_CONF_POPUP_OPEN', payload)
  },
}
