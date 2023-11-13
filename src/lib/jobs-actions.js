import { ONE_MINUTE } from './time.js'

export default {
  prueba: () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('prueba ejecutada')
        resolve()
      }, 1 * ONE_MINUTE)
    })
  }
}
