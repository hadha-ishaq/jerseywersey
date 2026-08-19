#!/usr/bin/env node

const { spawn } = require("child_process")
const fs = require("fs")
const path = require("path")

function readEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {}
  }

  return fs
    .readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .reduce((result, line) => {
      const trimmed = line.trim()

      if (!trimmed || trimmed.startsWith("#")) {
        return result
      }

      const equalsIndex = trimmed.indexOf("=")

      if (equalsIndex === -1) {
        return result
      }

      const key = trimmed.slice(0, equalsIndex).trim()
      let value = trimmed.slice(equalsIndex + 1).trim()

      if (
        (value.startsWith("\"") && value.endsWith("\"")) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }

      result[key] = value
      return result
    }, {})
}

const appDir = process.cwd()
const builtServerDir = path.join(appDir, ".medusa", "server")
const workingDir = fs.existsSync(path.join(builtServerDir, "package.json"))
  ? builtServerDir
  : appDir
const configHome = process.env.XDG_CONFIG_HOME || path.join(process.cwd(), ".config")
const medusaConfigDir = path.join(configHome, "medusa")

fs.mkdirSync(configHome, { recursive: true })
fs.mkdirSync(medusaConfigDir, { recursive: true })
fs.writeFileSync(
  path.join(medusaConfigDir, "config.json"),
  JSON.stringify(
    {
      cli: {
        packageManager: "npm",
      },
      telemetry: {
        enabled: false,
      },
    },
    null,
    2
  )
)

const fileEnv = readEnvFile(path.join(appDir, ".env"))
const env = {
  ...fileEnv,
  ...process.env,
  NODE_ENV: process.env.NODE_ENV || "production",
  HOST: process.env.HOST || "0.0.0.0",
  XDG_CONFIG_HOME: configHome,
  MEDUSA_DISABLE_TELEMETRY: process.env.MEDUSA_DISABLE_TELEMETRY || "true",
}

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
