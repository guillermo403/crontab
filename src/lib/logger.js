export default function (message) {
  const date = new Date().toLocaleString()

  console.log(`[${date}] # ${message}`)
}
