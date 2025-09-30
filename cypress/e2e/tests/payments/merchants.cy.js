/// <reference types="cypress" />
// https://on.cypress.io/introduction-to-cypress

describe.skip("Merchants @regression", () => {
  beforeEach(() => {
    cy.session("login", () => {
      cy.loginByAPI(Cypress.env("loginAdmin"), Cypress.env("passwordAdmin"));
    });
  });

  it("should update statuses successfully", () => {
    cy.visit("/merchants");

    // search functionality
    cy.searchMerchant("mckenzie lemke and");
    cy.contains("McKenzie Lemke and Brek").click();

    // status change functionality
    let statuses = [
      "Editing",
      "In Review",
      "Submitted to PayEngine",
      "Active",
      "Declined",
      "Cancelled",
      "Suspended",
    ];
    for (const item of statuses) {
      cy.updateMerchantstatus(item);
      cy.contains("Successfully updated", { timeout: 3000 });
      cy.wait(3000);
      cy.get(".alert-warning").then(($text) => {
        const text = $text.text();
        const expectedText = `Latest alert (see logs for more): ${item}`;
        expect(text).to.include(expectedText);
      });
    }
  });

  it("verify filters functionality", () => {
    cy.visit("/merchants");

    // filters functionality
    const statuses = [
      { status: "Submitted to PayEngine", text: "submitted to pe" },
      { status: "Applications in Editing", text: "editing" },
      { status: "Pending Additional Info", text: "submitted to pe" },
      { status: "Active", text: "active" },
    ];
    statuses.forEach((row) => {
      const status = row.status;
      const text = row.text;
      cy.contains(status).click();
      cy.contains(text, { timeout: 3000 });

      if (status == "Pending Additional Info") {
        // verify the text appears under the status
        cy.contains("Pending Additional Information");
      }

      // verify merchants with other statuses are not shown
      statuses.forEach((element) => {
        if (
          element.status !== row.status &&
          !(element.text == "submitted to pe" && row.text == "submitted to pe")
        ) {
          cy.contains(element.text).should("not.exist");
        }
      });
    });
  });

  it("verify merchant table columns", () => {
    cy.visit("/merchants");

    // check columns if there
    cy.contains("Merchant ID");
    cy.contains("Merchant Name");
    cy.contains("Status");
    cy.contains("Creation Date");
    cy.contains("Total Payment Volume");
  });

  it("verify invite merchant pop-up elements", () => {
    cy.visit("/merchants");

    // invite merchant
    const email = "meri+invitemerchant@payengine.co";
    cy.contains("Invite to merchant portal").click();
    cy.get('[name="name"]').type("Meri Invited Merchant");
    cy.get('[name="email"]').type(email);
    cy.contains("Send Invite").click();
    cy.contains(`Invitation to ${email} successfully sent`).should(
      "be.visible"
    );
  });

  it("verify create merchant page elements", () => {
    cy.visit("/merchants");

    // check button if there
    cy.contains("Create new merchant").click();
    cy.contains("Add new merchant").should("exist");

    // verify onboarding form sections
    cy.contains("Business Category").should("exist");
    cy.contains("Business Details").should("exist");
    cy.contains("Your Details").should("exist");
    cy.contains("Credit Card Processing").should("exist");
    cy.contains("Bank Details").should("exist");
    cy.contains("Fee Schedule").should("exist");
    cy.contains("Submission").should("exist");
  });
});
