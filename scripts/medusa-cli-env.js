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

function prepareMedusaCliEnv(appDir, overrides = {}) {
  const configHome = process.env.XDG_CONFIG_HOME || path.join(appDir, ".config")
  const medusaConfigDir = path.join(configHome, "medusa")
  const fileEnv = readEnvFile(path.join(appDir, ".env"))
  const mergedEnv = {
    ...fileEnv,
    ...process.env,
    ...overrides,
  }
  const databasePoolMin = mergedEnv.DATABASE_POOL_MIN || "0"
  const databasePoolMax = mergedEnv.DATABASE_POOL_MAX || "3"

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

  return {
    ...mergedEnv,
    XDG_CONFIG_HOME: configHome,
    MEDUSA_DISABLE_TELEMETRY: process.env.MEDUSA_DISABLE_TELEMETRY || "true",
    DATABASE_POOL:
      mergedEnv.DATABASE_POOL ||
      JSON.stringify({
        min: Number.parseInt(databasePoolMin, 10),
        max: Number.parseInt(databasePoolMax, 10),
      }),
  }
}

module.exports = {
  prepareMedusaCliEnv,
}
