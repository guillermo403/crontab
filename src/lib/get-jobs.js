import fs from 'fs/promises'
import { join } from 'path'
import { cronToJson } from './convert.js'

export default async function () {
  const jobsFileNames = ['jobs.json', 'jobs']
  let jobsPath = join(
    import.meta.url.replace('file://', ''),
    '..',
    '..',
    '..'
  )

  for await (const jobsFile of jobsFileNames) {
    if (await exists(join(jobsPath, jobsFile))) {
      jobsPath = join(jobsPath, jobsFile)
      break
    }
  }

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

async function exists (filePath) {
  return fs.access(filePath)
    .then(() => true)
    .catch(() => false)
}
