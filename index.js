import getJobs from './src/lib/get-jobs.js'
import logger from './src/lib/logger.js'
import loop from './src/loop.js'

getJobs()
  .then((jobs) => {
    const loadedJobs = Object.keys(jobs)
    logger(`${loadedJobs.length} Jobs loaded => ${loadedJobs.join(', ')}`)
    loop(jobs)
  })
  .catch((err) => {
    console.error(err)
  })
