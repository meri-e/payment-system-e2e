const { defineConfig } = require("cypress");
const baseConfig = require("../../cypress.config.js");

module.exports = defineConfig({
  ...baseConfig,

  env: {
    ...baseConfig.env,
    environment: "sandbox",
    loginAdmin: "meri+admin@payengine.co",
    passwordAdmin: "Qq1234567#",
    apiKey: "TODO",
    apiKeyMaster: "TODO"
  },

  e2e: {
    ...baseConfig.e2e,
    baseUrl: "https://console.payengine.dev",

    setupNodeEvents(on, config) {
      // implement node event listeners here if needed
      return config;
    },
  },
});
