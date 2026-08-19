#!/usr/bin/env node

const { spawn } = require("child_process")

const port = process.env.PORT || "8000"
const host = process.env.HOSTNAME || process.env.HOST || "0.0.0.0"
const nextBin = require.resolve("next/dist/bin/next", {
  paths: [process.cwd()],
})

const child = spawn(process.execPath, [nextBin, "start", "-p", port, "-H", host], {
  cwd: process.cwd(),
  env: {
    ...process.env,
    NODE_ENV: process.env.NODE_ENV || "production",
    HOSTNAME: host,
  },
  stdio: "inherit",
})

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }

  process.exit(code ?? 0)
})
