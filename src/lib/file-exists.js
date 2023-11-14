import fs from 'node:fs/promises'

export async function exists (filePath) {
  return fs.access(filePath)
    .then(() => true)
    .catch(() => false)
}
