export default function ({ app, redirect }) {
  // return redirect('/login')
  console.log('storage stuff', app.$storage.getLocalStorage('user'))
  return app.$storage.getLocalStorage('user')
}
