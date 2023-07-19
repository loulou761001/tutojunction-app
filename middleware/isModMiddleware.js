export default function ({ store, redirect }) {
  if (
    store.state.auth.loggedIn &&
    store.state.auth.user.role !== 'admin' &&
    store.state.auth.user.role !== 'moderator'
  ) {
    return redirect('/')
  }
}
