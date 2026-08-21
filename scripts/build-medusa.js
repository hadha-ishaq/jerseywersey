#!/usr/bin/env node

const { spawn } = require("child_process")
const { prepareMedusaCliEnv } = require("./medusa-cli-env")

const appDir = process.cwd()
const env = prepareMedusaCliEnv(appDir)
const cliPath = require.resolve("@medusajs/cli/cli.js", {
  paths: [appDir],
})

const child = spawn(process.execPath, [cliPath, "build"], {
  cwd: appDir,
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
