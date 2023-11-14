export function cronToJson (jobs) {
  const json = {}

  const lines = jobs.split('\n')
  for (const line of lines) {
    if (line.startsWith('#')) continue

    const [name, minute, hour, monthDay, month, weekDay, ...command] = line.split(' ')
    json[name] = {}
    json[name].cron = `${minute} ${hour} ${monthDay} ${month} ${weekDay}`
    if (command) json[name].command = command.join(' ')
    if (json[name].command === '') delete json[name].command
  }

  return json
}
