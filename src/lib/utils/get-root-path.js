import { join } from 'node:path'

export const getRootPath = () => {
  return join(
    import.meta.url.replace('file://', ''),
    '..',
    '..',
    '..',
    '..'
  )
}
