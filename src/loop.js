import executeLoop from './execute-loop.js'
import { ONE_SECOND } from './lib/time.js'
const loopInterval = ONE_SECOND * 3

let jobs = {}
function loop () {
  executeLoop(jobs)
}

export default function (j) {
  jobs = j
  loop()
  return setInterval(loop, loopInterval)
}
