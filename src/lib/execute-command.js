import { exec } from 'child_process'
import { promisify } from 'util'
const execAsync = promisify(exec)

export default async function (command) {
  return new Promise((resolve, reject) => {
    execAsync(command)
      .then(resolve)
      .catch(reject)
  })
}
