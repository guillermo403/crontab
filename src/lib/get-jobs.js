import fs from 'fs/promises'
import { join } from 'path'
import { cronToJson } from './utils/convert.js'
import { exists } from './file-exists.js'
import { getRootPath } from './utils/get-root-path.js'

export default async function () {
  const jobsFileNames = ['jobs.json', 'jobs']
  const rootPath = getRootPath()
  let jobsPath

  for await (const jobsFile of jobsFileNames) {
    if (await exists(join(rootPath, jobsFile))) {
      jobsPath = join(rootPath, jobsFile)
      break
    }
  }

  if (!jobsPath) throw new Error('Jobs file not found')

  const jobs = await fs.readFile(jobsPath, 'utf-8')

  const jobsFileExt = jobsPath.split('.').pop()

  if (jobsFileExt !== 'json') {
    try {
      const j = cronToJson(jobs)
      return j
    } catch (error) {
      return {}
    }
  }

  try {
    const j = JSON.parse(jobs)
    return j
  } catch (error) {
    return {}
  }
}
