const net = require("net")

function formatHostHint(hostname, port) {
  if (!hostname) {
    return "DATABASE_URL is missing a hostname."
  }

  if (hostname.endsWith(".supabase.co") && port === 5432) {
    return [
      "Render could not reach the Supabase direct database endpoint.",
      "Use Supabase's Session Pooler connection string for DATABASE_URL instead of the direct db.<project>.supabase.co:5432 URL.",
      "The pooler host usually looks like aws-*.pooler.supabase.com and commonly uses port 5432 for session mode or 6543 for transaction mode.",
    ].join(" ")
  }

  return `Render could not reach ${hostname}:${port}. Check DATABASE_URL host, port, password, network allow-list, and SSL settings.`
}

function checkDatabaseUrl(databaseUrl, timeoutMs = 8000) {
  if (!databaseUrl) {
    return Promise.reject(
      new Error("DATABASE_URL is not set. Set it in Render before starting the backend.")
    )
  }

  let url

  try {
    url = new URL(databaseUrl)
  } catch {
    return Promise.reject(
      new Error("DATABASE_URL is invalid. It must be a valid postgres:// or postgresql:// URL.")
    )
  }

  const hostname = url.hostname
  const port = Number.parseInt(url.port || "5432", 10)

  return new Promise((resolve, reject) => {
    const socket = net.createConnection({ host: hostname, port })
    const cleanup = () => {
      socket.removeAllListeners()
      socket.destroy()
    }

    socket.setTimeout(timeoutMs)
    socket.once("connect", () => {
      cleanup()
      resolve()
    })
    socket.once("timeout", () => {
      cleanup()
      reject(
        new Error(
          `Timed out connecting to DATABASE_URL at ${hostname}:${port}. ${formatHostHint(
            hostname,
            port
          )}`
        )
      )
    })
    socket.once("error", (error) => {
      cleanup()
      reject(
        new Error(
          `Unable to connect to DATABASE_URL at ${hostname}:${port}: ${
            error.code || error.message
          }. ${formatHostHint(hostname, port)}`
        )
      )
    })
  })
}

module.exports = {
  checkDatabaseUrl,
}
