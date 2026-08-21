const { loadEnv, defineConfig } = require("@medusajs/framework/utils")

loadEnv(process.env.NODE_ENV || "development", process.cwd())

const databasePoolMax = Number.parseInt(process.env.DATABASE_POOL_MAX || "3", 10)
const databasePoolMin = Number.parseInt(process.env.DATABASE_POOL_MIN || "0", 10)
const shouldUseDatabaseSsl =
  process.env.NODE_ENV === "production" && process.env.DATABASE_SSL !== "false"

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    databaseDriverOptions: {
      ...(shouldUseDatabaseSsl
        ? {
            connection: {
              ssl: {
                rejectUnauthorized: false,
              },
            },
          }
        : {}),
      pool: {
        min: databasePoolMin,
        max: databasePoolMax,
        idleTimeoutMillis: Number.parseInt(
          process.env.DATABASE_POOL_IDLE_TIMEOUT_MS || "10000",
          10
        ),
      },
    },

    http: {
      storeCors: process.env.STORE_CORS,
      adminCors: process.env.ADMIN_CORS,
      authCors: process.env.AUTH_CORS,
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
    },
  },

  modules: [
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            resolve:
              "@alchemilla/medusa-razorpay/providers/payment-razorpay/src",
            id: "razorpay",
            options: {
              key_id: process.env.RAZORPAY_ID || "",
              key_secret: process.env.RAZORPAY_SECRET || "",
              razorpay_account: process.env.RAZORPAY_ACCOUNT || "",
              webhook_secret: process.env.RAZORPAY_WEBHOOK_SECRET || "",
              manual_expiry_period: 20,
              refund_speed: "normal",
              auto_capture: false,
            },
          },
        ],
      },
    },
  ],
})
