export default function (context, inject) {
  inject('utils', {
    consoleLog,
    consoleError,
    checkLoggedIn,
  })
  const NODE_ENV = context.env.NODE_ENV

  // Utility :
  // Function to log in the console
  function consoleLog(message = '', data = '') {
    if (NODE_ENV === 'production') return
    console.log(message, data)
  }

  // Utility :
  // Function to log in the console with error
  function consoleError(message = '', data = '') {
    if (NODE_ENV === 'production') return
    console.error(message, data)
  }

  function checkLoggedIn(axios) {
    console.log('plugin')
    if (!localStorage.getItem('user')) return false
    axios
      .get('/users/checkLoggedIn', {
        headers: { authorization: 'bearer ' + localStorage.getItem('user') },
      })
      .then(() => {
        console.log(true)
        return true
      })
      .catch(() => {
        console.log(false)
        return false
      })
  }
}
