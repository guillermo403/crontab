import fs from 'node:fs/promises'
import { Storage } from 'megajs'

const BACKUPS_FOLDER_ID = 'q5wRXLBB'

let storage
async function upload (filePath, fileName) {
  await initStorage()

  const fileData = await fs.readFile(filePath)

  const file = await storage.upload({
    name: fileName,
    size: fileData.length
  }, fileData).complete

  await file.moveTo(BACKUPS_FOLDER_ID)

  return file
}

export default { upload }

async function initStorage () {
  if (!storage) {
    storage = await new Storage({
      email: process.env.MEGA_EMAIL,
      password: process.env.MEGA_PASSWORD
    }).ready
  }
}

// eslint-disable-next-line no-unused-vars
function getFolders (storage, id = 'root') {
  if (id === 'root') {
    return storage.root.children
      .filter(child => child.directory)
      .map(child => ({ name: child.name, id: child.nodeId, children: getFolders(storage, child.nodeId) }))
  }

  return storage.root.children
    .find(child => child.nodeId === id)
    ?.children
    ?.filter(child => child.directory)
    .map(child => ({ name: child.name, id: child.nodeId, children: getFolders(storage, child.nodeId) }))
}
