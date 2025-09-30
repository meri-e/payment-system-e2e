/// <reference types="cypress" />
// https://on.cypress.io/introduction-to-cypress

describe.skip("Masspay Onboarding", () => {
  let masspayCredentials;

  before(function () {
    const environment = Cypress.env("environment");
    cy.fixture("credentials").then((credentials) => {
      masspayCredentials = credentials[environment]?.masspay;
    });
  });

  beforeEach(() => {
    cy.session("login", () => {
      cy.visit("/signin");
      cy.login(masspayCredentials.email, masspayCredentials.password);
    });
  });

  it("should complete the onboarding process for Masspay", function () {
    // create new merchant
    cy.visit("/dashboard");
    cy.openMenuItem("merchant");

    // create new merchant
    cy.contains("Create new merchant").click();
    cy.wait(1000); //to load
    cy.get('input[name="businessName"]', { timeout: 10000 })
      .should("be.visible")
      .should("not.be.disabled")
      .type("Test Merchant");
    cy.contains("button", "Create").click();
    cy.contains("Add new merchant").should("exist");


    // fill in the onboarding form
    cy.contains("Fill test data").click();
    cy.contains("button", "Continue").click();

    cy.clickNext(8);
    cy.get('input[name="acknowledgement"]').click({ force: true });
    cy.contains(
      "button",
      "Submit application to merchant for signature"
    ).click();

    // verify onboarding form is submitted successfully
    cy.contains("Successfully submitted").should("exist");
    cy.contains(
      "Your application has been submitted. We'll review and get in touch with you within 2 business days."
    ).should("exist");
    cy.contains("button", "OK").click();
  });
});
