export const state = () => ({
  counter: 0,
  categories: [],
  addImgState: 0,
  selectedImg: null,
})

export const getters = {
  isAuthenticated(state) {
    return state.auth.loggedIn
  },

  loggedInUser(state) {
    return state.auth.user
  },
  getCategories(state) {
    console.log(state.categories)
    return state.categories
  },
  getSelectedImg(state) {
    return state.selectedImg
  },
  getAddImgState(state) {
    return state.addImgState
  },
}

export const mutations = {
  FILL_CATEGORIES(state, payload) {
    state.categories = payload
  },
  FILL_SELECTED_IMG(state, payload) {
    state.selectedImg = payload
    state.addImgState++
  },
}

export const actions = {
  fillCategories: async function ({ commit, state }) {
    if (!state.categories.length) {
      await this.$axios.get('/categories').then((data) => {
        console.log('fill cats, ', data.data)
        commit('FILL_CATEGORIES', data.data)
      })
    }
  },
  addImg: function ({ commit, state }, img) {
    this.$utils.consoleLog('action', img)
    commit('FILL_SELECTED_IMG', img)
  },
}
