export const state = () => ({
  counter: 0,
  categories: [],
})

export const getters = {
  isAuthenticated(state) {
    return state.auth.loggedIn
  },

  loggedInUser(state) {
    return state.auth.user
  },
  getCategories(state) {
    return state.categories
  },
}

export const mutations = {
  FILL_CATEGORIES(state, payload) {
    state.categories = payload
  },
}

export const actions = {
  fillCategories: function ({ commit, state }) {
    if (!state.categories.length) {
      this.$axios.get('/categories').then((data) => {
        console.log('fill cats, ', data.data)
        commit('FILL_CATEGORIES', data.data)
      })
    }
  },
}
