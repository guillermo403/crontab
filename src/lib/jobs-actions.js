import executeCommand from './execute-command.js'
import logger from './logger.js'
import mega from './mega.js'
import { join } from 'node:path'
import { homedir } from 'node:os'

export default {
  backup
}

function backup () {
  return new Promise((resolve, reject) => {
    executeCommand('bash $HOME/backup/backup.sh')
      .then(() => {
        // Get path from '$HOME/backups/backup-20231114.tar.gz'
        const fileName = 'backup-20231114.tar.gz'
        const filePath = join(homedir(), 'backups', fileName)

        mega.upload(filePath, fileName)
          .then(uploadedFile => {
            logger(`File uploaded: ${uploadedFile.name}`)
            resolve()
          })
          .catch(error => reject(error))
      })
      .catch(error => reject(error))
  })
}
