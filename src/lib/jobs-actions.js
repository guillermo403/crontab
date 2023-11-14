import executeCommand from './execute-command.js'
import logger from './logger/logger.js'
import mega from './mega.js'
import { exists } from './file-exists.js'
import { getRootPath } from './utils/get-root-path.js'
import { join } from 'node:path'
import { homedir } from 'node:os'

export default {
  backup
}

function backup () {
  let backupName, backupPath
  return new Promise((resolve, reject) => {
    getBackupPath()
      .then(([path, name]) => {
        backupName = name
        backupPath = path
        return executeCommand(`bash ${getRootPath()}/backup.sh "${backupPath}"`)
      })
      .then(() => mega.upload(backupPath, backupName))
      .then(uploadedFile => {
        logger(`File uploaded: ${uploadedFile.name}`)
        resolve()
      })
      .catch(error => reject(error))
  })
}

async function getBackupPath () {
  let cont = 1
  const date = new Date()
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  const originalName = `backup-${year}${month}${day}`
  const path = join(homedir(), 'backups')

  let name = originalName

  if (await exists(`${join(path, name)}.tar.gz`)) {
    while (await exists(`${join(path, name)}.tar.gz`)) {
      cont++
      name = `${originalName}(${cont})`
    }
  }

  return Promise.resolve([join(path, `${name}.tar.gz`), `${name}.tar.gz`])
}
