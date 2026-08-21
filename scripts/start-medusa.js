#!/usr/bin/env node

const { spawn } = require("child_process")
const fs = require("fs")
const path = require("path")
const { prepareMedusaCliEnv } = require("./medusa-cli-env")
const { checkDatabaseUrl } = require("./check-database-url")

const appDir = process.cwd()
const builtServerDir = path.join(appDir, ".medusa", "server")
const workingDir = fs.existsSync(path.join(builtServerDir, "package.json"))
  ? builtServerDir
  : appDir
const env = prepareMedusaCliEnv(appDir, {
  NODE_ENV: process.env.NODE_ENV || "production",
  HOST: process.env.HOST || "0.0.0.0",
  __MEDUSA_DB_CONNECTION_MAX_RETRIES:
    process.env.__MEDUSA_DB_CONNECTION_MAX_RETRIES || "2",
})

const cliPath = require.resolve("@medusajs/cli/cli.js", {
  paths: [appDir],
})

async function start() {
  await checkDatabaseUrl(env.DATABASE_URL)

  const child = spawn(process.execPath, [cliPath, "start"], {
    cwd: workingDir,
    env,
    stdio: "inherit",
  })

  child.on("exit", (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal)
      return
    }

    process.exit(code ?? 0)
  })
}

start().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
