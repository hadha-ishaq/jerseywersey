#!/usr/bin/env node

const { spawn } = require("child_process")
const fs = require("fs")
const path = require("path")
const { prepareMedusaCliEnv } = require("./medusa-cli-env")

const appDir = process.cwd()
const builtServerDir = path.join(appDir, ".medusa", "server")
const workingDir = fs.existsSync(path.join(builtServerDir, "package.json"))
  ? builtServerDir
  : appDir
const env = prepareMedusaCliEnv(appDir, {
  NODE_ENV: process.env.NODE_ENV || "production",
  HOST: process.env.HOST || "0.0.0.0",
})

const cliPath = require.resolve("@medusajs/cli/cli.js", {
  paths: [appDir],
})
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
