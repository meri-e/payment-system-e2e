/// <reference types="cypress" />
// https://on.cypress.io/introduction-to-cypress

const {
    elavonFeeScheduleId,
    accountId,
    partnerAccountId,
  } = require("../../../../utils/constants");
  
  describe.skip("Gateway Onboarding @regression", () => {
    let elavonCredentials;
  
    before(function () {
      const environment = Cypress.env("environment");
      cy.fixture("credentials").then((credentials) => {
        elavonCredentials = credentials[environment]?.elavon;
      });
    });
  
    beforeEach(() => {
      cy.session("loginByAPI", () => {
        cy.visit("/signin");
        cy.loginByAPI(elavonCredentials.email, elavonCredentials.password);
      });
    });
  
    it("Gateway Only @e2e", function () {
      cy.visit("/dashboard");
      cy.createNewMerchant("Test Merchant");
      cy.getMerchantId(elavonCredentials.privateKey).then((merchantId) => {
        cy.fillTestData(8);
        cy.updateMerchantFeeSchedule(merchantId, elavonFeeScheduleId, elavonCredentials.privateKey);
        cy.submitMerchant('elavon');
      });
      cy.contains("Application awaiting merchant's signature").should("exist");
      cy.contains("The application was submitted and can not be modified").should(
        "exist"
      );
      cy.contains("submitted to pe").should("exist");
    });
  });
  