/// <reference types="cypress" />
// https://on.cypress.io/introduction-to-cypress

const {
  stripeFeeScheduleId,
  stripeMinimalFeeScheduleId,
} = require("../../../../utils/constants");

describe.skip("Stripe Onboarding @regression", () => {
  let stripeCredentials;
  let stripeMinimalCredentials;
  let merchantName = `Stripe Merchant ${Date.now()}`; 

  before(function () {
    const environment = Cypress.env("environment");
    cy.fixture("credentials").then((credentials) => {
      stripeCredentials = credentials[environment]?.stripe;
      stripeMinimalCredentials = credentials[environment]?.stripeMini;
    });
  });

  it.skip("Stripe @e2e", () => {
    cy.session("login", () => {
      cy.visit("/signin");
      cy.loginByAPI(stripeCredentials.email, stripeCredentials.password);
    });
    cy.visit("/dashboard");
    cy.createNewMerchant(merchantName);
    cy.getMerchantId(stripeCredentials.privateKey).then((merchantId) => {
      cy.fillTestData(8);
      cy.updateMerchantFeeSchedule(
        merchantId,
        stripeFeeScheduleId,
        stripeCredentials.privateKey
      );
    });
    cy.contains(
      "Please check this box to acknowledge that you have read the Stripe Connected Account Agreement"
    )
      .should("exist")
      .and("contain", "https://stripe.com/legal/connect-account");
    cy.submitMerchant("stripe");
    cy.contains("Application submitted").should("exist");
    cy.contains("Thank you for submitting your application!").should("exist");
    cy.contains("Thank you!").should("exist");
    cy.contains("in review").should("exist");
  });

  it.skip("Stripe Minimal Form @e2e", function () {
    cy.session("login", () => {
      cy.visit("/signin");
      cy.loginByAPI(stripeMinimalCredentials.email, stripeMinimalCredentials.password);
    });
    cy.visit("/dashboard");
    cy.createNewMerchant(merchantName);
    cy.getMerchantId(stripeMinimalCredentials.privateKey).then((merchantId) => {
      cy.updateMerchantFeeSchedule(
        merchantId,
        stripeMinimalFeeScheduleId,
        stripeMinimalCredentials.privateKey
      );
      cy.reload();
      cy.fillTestData(4);
    });
    cy.contains(
      "Please check this box to acknowledge that you have read the Stripe Connected Account Agreement"
    )
      .should("exist")
      .and("contain", "https://stripe.com/legal/connect-account");
    cy.submitMerchant("stripe");
    cy.contains("Application submitted").should("exist");
    cy.contains("Thank you for submitting your application!").should("exist");
    cy.contains("Thank you!").should("exist");
    cy.contains("in review").should("exist");
  });
});
