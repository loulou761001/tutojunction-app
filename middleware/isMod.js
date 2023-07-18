export default function ({ store, redirect, error }) {
  if (
    store.state.auth.loggedIn &&
    (!store.state.auth.user.role === 'admin' ||
      !store.state.auth.user.role === 'moderator')
  ) {
    return redirect('/')
  }
}
