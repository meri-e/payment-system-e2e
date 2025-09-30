/// <reference types="cypress" />
// https://on.cypress.io/introduction-to-cypress

describe.skip("Disputes @regression", () => {
  beforeEach(() => {
    cy.session("login", () => {
      cy.loginByAPI(Cypress.env("loginAdmin"), Cypress.env("passwordAdmin"));
    });
  });

  it("verify search functionality", () => {
    cy.visit("/dispute");

    // search by transaction ID
    cy.get('[data-cy="transaction-search-box"]').clear();
    cy.get('[data-cy="transaction-search-box"]').type(transactionId);
    cy.contains("Chargeback Received").click();

    // dispute management pop-up validation
    cy.contains("Accept").should("exist");
    cy.contains("Add more comment or attachment").should("exist");
  });

  it("verify filter functionality", () => {
    cy.visit("/dispute");

    // filter by amount functionality
    cy.contains("Filter (0)").click();
    cy.contains("Amount").click();
    cy.get('[name="amount"]').clear().type("13.13");
    cy.contains("Done").click();
    cy.contains("Chargeback Received").click();
    // verify the amount
    cy.contains("13.13");
    cy.contains("Close").click();
  });
});
