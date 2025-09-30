/// <reference types="cypress" />
// https://on.cypress.io/introduction-to-cypress

describe.skip("Account Webhooks @regression", () => {
  beforeEach(() => {
    cy.session("login", () => {
      cy.loginByAPI(Cypress.env("loginAdmin"), Cypress.env("passwordAdmin"));
    });
  });

  it("verify create webhook functionality", () => {
    cy.visit("account/webhook");

    let webhookUrl = "https://test.automation";
    cy.createWebhook(webhookUrl);
    cy.contains(webhookUrl).should("exist");
  });

  it("verify webhook received", () => {
    cy.visit("account/webhook");
    
    cy.setAccountWebhookDeliveryCount("1");
    cy.createPaymentSale().then((response) => {
      expect(response.status).to.eq(200);
    });
    cy.wait(5000); // until the delivery is done
    cy.contains("Recent Deliveries").click();
    cy.get('.tabulator-row').each(($row) => {
        if ($row.text().includes('PAYMENT_SALE')) {
          cy.wrap($row).should('contain.text', 'https://test.automation');
          cy.wrap($row).should('contain.text', 'timeout');
        }
      });
  });
});
