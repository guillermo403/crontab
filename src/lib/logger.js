export default function (message) {
  const date = new Date().toLocaleString()

  process.stdin.write(`[${date}] # ${message}\n`)
}
