import executeCommand from './lib/execute-command.js'
import jobsActions from './lib/jobs-actions.js'
import logger from './lib/logger.js'

export default async function (jobs) {
  for (const key in jobs) {
    if (hasToExecute(jobs, key)) {
      logger(`Executing job ${key}`)
      jobs[key].status = STATES.executing
      try {
        if (jobs[key].command) await executeCommand(jobs[key].command)
        else await jobsActions[key]()
        logger(`Job ${key} finished`)
        jobs[key].lastExecution = getCurrentTime()
        jobs[key].status = STATES.done
      } catch (error) {
        logger(`Job ${key} failed => ${error.message ?? ''}`)
        jobs[key].status = STATES.failed
        if (!Object.prototype.hasOwnProperty.call(jobs[key], 'retries')) jobs[key].retries = 3
      } finally {
        //
      }
    }
  }
}

function getCurrentTime () {
  const d = new Date()
  let hour = String(d.getHours())
  let minute = String(d.getMinutes())
  const monthDay = d.getDate()
  const month = d.getMonth()
  const weekDay = d.getDay()

  while (hour.length < 2) {
    hour = `0${hour}`
  }

  while (minute.length < 2) {
    minute = `0${minute}`
  }

  return {
    time: `${hour}:${minute}`,
    monthDay,
    month,
    weekDay,
    hour,
    minute
  }
}

function hasToExecute (jobs, key) {
  if (jobs[key].status === STATES.executing) return false
  if (jobs[key].status === STATES.discard) return false

  if (jobs[key].status === STATES.failed) {
    if (jobs[key].retries > 0) {
      logger(`Retrying job ${key}. Left ${jobs[key].retries} retries`)
      jobs[key].retries--
      return true
    } else {
      jobs[key].status = STATES.discard
      delete jobs[key].retries
      logger(`Discarding job ${key}. No more retries`)
      return false
    }
  }

  const currentTime = getCurrentTime()
  const [minute, hour, monthDay, month, weekDay] = jobs[key].cron.split(' ')

  if (!minute || !hour || !monthDay || !month || !weekDay) {
    throw new Error(`Invalid cron expression for job ${key}`)
  }

  // Si el job ya se ha ejecutado pero el tiempo de ejecución ya ha pasado se reinicia para la próxima ejecución
  if (currentTime.time !== `${hour}:${minute}` && jobs[key].status === STATES.done) {
    jobs[key].status = STATES.pending
    return false
  }

  // Si tiene un * en los minutos, solo se ejecuta cada minuto
  if (minute === '*' && jobs[key].lastExecution?.minute === currentTime.minute) return false

  if (currentTime.monthDay !== monthDay && monthDay !== '*') return false
  if (currentTime.month !== month && monthDay !== '*') return false
  if (currentTime.weekDay !== weekDay && monthDay !== '*') return false
  if (currentTime.hour !== hour && hour !== '*') return false
  if (currentTime.minute !== minute && minute !== '*') return false

  // Si el job ya se ejecutó, no se ejecuta de nuevo
  if (jobs[key].status === STATES.done) return false

  jobs[key].status = STATES.pending
  return true
}

const STATES = {
  pending: 0,
  done: 1,
  failed: 2,
  executing: 3,
  discard: 4
}
