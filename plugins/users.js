export default function (context, inject) {
  inject('users', {
    currentUser,
  })
  // const env = context.env

  // GET CURRENT LOGGED IN USER
  async function currentUser() {
    const user = await context.$auth.fetchUser()
    return user
  }
}
