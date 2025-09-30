/// <reference types="cypress" />
// https://on.cypress.io/introduction-to-cypress

describe.skip("Transactions @regression", () => {
  beforeEach(() => {
    cy.session("login", () => {
      cy.loginByAPI(Cypress.env("loginAdmin"), Cypress.env("passwordAdmin"));
    });
  });

  it("verify search functionality", () => {
    cy.visit("/transactions");

    // search by transaction ID functionality
    cy.get('[data-cy="transaction-search-box"]').clear();
    cy.get('[data-cy="transaction-search-box"]').type("8593154449");
    cy.contains("McKenzie Lemke and").click();
    cy.contains("Close").click();
  });

  it("verify filter functionality", () => {
    cy.visit("/transactions");

    // filter by amount functionality
    cy.contains("McKenzie Lemke and").should("exist");
    cy.contains("Filter (0)").click();
    cy.contains("Amount").click();
    cy.get('[name="amount"]').clear().type("1020");
    cy.contains("Done").click();
    cy.contains("McKenzie Lemke and").click();
    // verify the amount
    cy.contains("1,020.00");
    cy.contains("Close").click();
  });

  it("verify country selection functionality", () => {
    cy.visit("/transactions");

    // filter merchants by country
    const merchants = [
      { name: "MERI Canada merchant", country: "CA" },
      { name: "MERI Australia merchant", country: "AU" },
      { name: "MERI United States merchant", country: "US" },
    ];

    merchants.forEach((row) => {
      const name = row.name;
      const country = row.country;

      // verify the merchant is shown
      cy.get('[data-cy="country-select"]').select(country, { force: true });
      cy.contains(name).should("exist");

      // verify merchants from other countries are not shown
      merchants.forEach((element) => {
        if (element.name !== row.name) {
          cy.contains(element.name).should("not.exist");
        }
      });
    });
  });

  it("verify order number column is visible", () => {
    cy.visit("/account");

    // change the account setting to display order number
    cy.contains("Settings").click();
    cy.setSettings("enable_transactions_order_id_column", "yes");

    // verify order number is shown
    cy.openMenuItem("transactions");
    cy.contains("Order #");
  });

  it("verify order number column is hidden", () => {
    cy.visit("/account");

    // change the account setting to hide order number
    cy.contains("Settings").click();
    cy.setSettings("enable_transactions_order_id_column", "no");

    // verify order number is shown
    cy.openMenuItem("transactions");
    cy.contains("Order #").should("not.exist");
  });
});
