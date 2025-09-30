const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    experimentalStudio: true,
    experimentalWebKitSupport: true,
    chromeWebSecurity: false,
  },

  env: {
    NODE_ENV: "test",
  },

  reporter: "mochawesome",
  reporterOptions: {
    reportDir: "cypress/results",
    reportFilename: "report.html",
    overwrite: false,
    html: false,
    json: true,
  },
});