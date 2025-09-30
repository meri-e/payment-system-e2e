const { defineConfig } = require("cypress");
const baseConfig = require("../../cypress.config.js");
const knexLib = require("knex");
require("dotenv").config({ path: "../../.env" });

const poolMin = parseInt(process.env.POSTGRES_POOL_MIN || "2", 10);
const poolMax = parseInt(process.env.POSTGRES_POOL_MAX || "9", 10);

const knex = knexLib({
  client: "pg",
  connection: {
    host: process.env.POSTGRES_HOST_TEST,
    port: Number(process.env.POSTGRES_PORT_TEST),
    user: process.env.POSTGRES_USER_TEST,
    password: process.env.POSTGRES_PASSWORD_TEST,
    database: process.env.POSTGRES_DB_TEST,
  },
  pool: { min: poolMin, max: poolMax },
});

module.exports = defineConfig({
  ...baseConfig,

  env: {
    ...baseConfig.env,
    environment: "development",
    NODE_ENV: "test",
    loginAdmin: "meri+admin@payengine.co",
    passwordAdmin: "Qq1234567#",
    apiKey:
      "sk_dev_gEpYIsxP45aZKdoVy0XzFQTwBYMyxWzHo3zAkk95a2D8icY6GkBLrTUIMxkaXcE9GPg9ySUUWil04QjEp95unAJF8yysmhGX7lM7",
    apiKeyMaster:
      "sk_dev_ZLpcl58qD4WQD2l2vwuESLbdklSQSJS92FTD8StAVX01Zjzczvzbwz75Q3KBs37KDHAYxnzThEMJ6LgAIf0YeIQYO69oDIPuE9Jj",
  },

  e2e: {
    ...baseConfig.e2e,
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      on("task", {
        setMerchantSigned: async ({ id }) => {
          console.log("setMerchantSigned called with:", id);
          return knex("merchant").where({ id }).update({ is_signed: true });
        },
      });

      return config;
    },
  },
});
