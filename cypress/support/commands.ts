/// <reference types="cypress" />
// https://on.cypress.io/introduction-to-cypress

declare namespace Cypress {
  interface Chainable<Subject> {
    loginByUI(email: string, password: string): Chainable<any>;
    loginByAPI(email: string, password: string): Chainable<any>;
    loginAs(role: string): Chainable<any>;
    logout(): Chainable<any>;
    skipIntro(): Chainable<any>;
    openOnboardingForm(): Chainable<any>;
    openInviteMerchant(): Chainable<any>;
    openMenuItem(menu: string): Chainable<any>;
    openAccountMenuItem(menu: string): Chainable<any>;
    updateMerchantstatus(menu: string): Chainable<any>;
    searchMerchant(menu: string): Chainable<any>;
    getIframe(menu: string): Chainable<any>;
    changeMerchantMenu(menu: string): Chainable<any>;
    setSettings(name: string, value: "yes" | "no"): Chainable<any>;
    setAccountWebhookDeliveryCount(times: string): Chainable<any>;
    clickNext(times: number): Chainable<any>;
    loginApi(role: string): Chainable<any>;
    createWebhook(url: string): Chainable<any>;
    updateAccountSettings(id: string, newSettings: string): Chainable<any>;
    updatePapiAccountSettings(id: string, newSettings: string): Chainable<any>;
    createPaymentSale(): Chainable<any>;
    createNewMerchant(businessName?: string): Chainable<any>;
    fillTestData(sectionCount: number): Chainable<any>;
    submitMerchant(processor: string): Chainable<any>;
    getMerchantId(privateKey: string): Chainable<any>;
    updateMerchantFeeSchedule(
      merchantId: string,
      feeScheduleId: string,
      privateKey: string
    ): Chainable<any>;
  }
}

Cypress.Commands.add("loginByUI", (email: string, password: string) => {
  cy.get("#email").type(email);
  cy.get('[name="password"]').type(password);
  cy.get(".form_form__KNURO button").click();
});

Cypress.Commands.add("loginByAPI", (email: string, password: string) => {
  console.log("Login: ", email);
  console.log("Password: ", password);
  cy.request({
    method: "POST",
    url: "/api/user/auth",
    body: {
      email,
      password,
    },
    headers: {
      "Content-Type": "application/json",
    },
    failOnStatusCode: false,
  }).then((response) => {
    expect(response.status).to.eq(200);
    cy.window().then((win) => {
      win.localStorage.setItem("user", JSON.stringify(response.body));
    });
  });
  cy.visit("/dashboard");
});

Cypress.Commands.add("loginAs", (role: string) => {
  const environment = Cypress.env("environment");

  cy.fixture("credentials").then((credentials) => {
    const loginCreds = credentials[environment]?.[role];
    cy.loginByAPI(loginCreds.email, loginCreds.password);
  });
});

Cypress.Commands.add("logout", () => {
  // cy.contains('span.label', 'Sign out').click({ force: true });
  cy.get(".nav-links >div", { timeout: 3000 }).click();
});

Cypress.Commands.add("skipIntro", () => {
  cy.contains("Skip Intro", { timeout: 3000 }).click();
});


Cypress.Commands.add("openOnboardingForm", () => {
  cy.contains("Create new merchant", { timeout: 3000 }).click();
});

Cypress.Commands.add("openInviteMerchant", () => {
  cy.contains("Invite to merchant portal").click();
});

Cypress.Commands.add("openMenuItem", (selectedMenu: string) => {
  cy.get(`[href="/${selectedMenu}"]`).click({ timeout: 3000 });
});

Cypress.Commands.add("openAccountMenuItem", (selectedMenu: string) => {
  cy.get(`[href="/account/${selectedMenu}"]`).click({ timeout: 3000 });
});

Cypress.Commands.add("updateMerchantstatus", (selectedStatus: string) => {
  cy.get('[data-cy="edit-merchant-status"]').click();
  cy.get("#change-status-select").type(`${selectedStatus}{enter}`);
  cy.get(".ql-editor").type(selectedStatus);
  cy.contains("Update").click();
});

Cypress.Commands.add("searchMerchant", (merchantName: string) => {
  cy.get('[data-cy="search-box"]').clear();
  cy.get('[data-cy="search-box"]').type(merchantName);
});

Cypress.Commands.add("changeMerchantMenu", (menuItem: string) => {
  cy.contains(menuItem).click();
});

Cypress.Commands.add("getIframe", (selector: string) => {
  const getIframeDocument = () => {
    return cy.get(selector).its("0.contentDocument").should("exist");
  };
  return getIframeDocument()
    .its("body")
    .should("not.be.undefined")
    .then(cy.wrap);
});

Cypress.Commands.add("changeMerchantMenu", (menuItem: string) => {
  cy.get("button").contains(menuItem).click();
});

Cypress.Commands.add("setSettings", (name, value) => {
  const selector = `[for="${name}-${value}"]`;
  cy.get(selector).click();
  cy.get('[data-cy="save-merchant-settings"] button').click();
});

Cypress.Commands.add("setAccountWebhookDeliveryCount", (times: string) => {
  const selector = `[name="webhook_max_attempts"]`;
  cy.get(selector).click().clear().type(times);
  cy.contains("button", "Save").click();
});

Cypress.Commands.add("clickNext", (times: number) => {
  for (let i = 0; i < times; i++) {
    cy.contains("button", "Next").click();
  }
});

Cypress.Commands.add("createWebhook", (url: string) => {
  cy.contains("Create Webhook").click();
  cy.get('[type="url"]').type(url);
  cy.contains("button", "Save").click();
  cy.contains("webhook created").should("exist");
});

Cypress.Commands.add("createPaymentSale", () => {
  const defaultPayload = {
    merchant_id: "8690728a-456f-4c37-87bc-f8588a4b4fe2",
    data: {
      transactionAmount: "2",
      cardToken: "token",
    },
  };

  return cy.request({
    method: "POST",
    url: "/api/payment/sale",
    body: { ...defaultPayload },
    headers: {
      Authorization:
        "Basic ToDo",
      "Content-Type": "application/json",
    },
  });
});

Cypress.Commands.add("createNewMerchant", (businessName = "Test Merchant") => {
  cy.openMenuItem("merchant");
  cy.contains("Create new merchant", { timeout: 10000 }).click();
  cy.get('input[name="businessName"]', { timeout: 10000 })
    .should("be.visible")
    .should("not.be.disabled")
    .clear()
    .type(businessName);
  cy.contains("button", "Create").click();
  cy.wait(3000);
});

Cypress.Commands.add("fillTestData", (sectionCount: number) => {
  cy.contains("Fill test data").click();
  cy.contains("button", "Continue").click();
  cy.clickNext(sectionCount);
  cy.get('input[name="acknowledgement"]').check({ force: true });
});

Cypress.Commands.add("submitMerchant", (processor: string) => {
  if (processor === "stripe") {
    cy.contains("button", "Submit Agreement").click();
  } else {
    cy.contains(
      "button",
      "Submit application to merchant for signature"
    ).click();
  }
});

Cypress.Commands.add(
  "updateMerchantFeeSchedule",
  (merchantId: string, feeScheduleId: string, privateKey: string) => {
    cy.request({
      method: "PATCH",
      url: `/api/v2/merchant/${merchantId}/fee-schedule`,
      body: {
        fee_schedule_id: feeScheduleId,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${privateKey}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      cy.log(`Merchant ${merchantId} fee schedule updated to ${feeScheduleId}`);
    });
  }
);

Cypress.Commands.add("getMerchantId", (privateKey: string) => {
  cy.log("Getting merchant ID...");
  return cy
    .request({
      method: "GET",
      url: "/api/merchant?page=1&size=1&country=US",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${privateKey}`,
      },
    })
    .then((response) => {
      console.log("Merchant API response:", response); 
      if (!response.body.data || response.body.data.length === 0) {
        throw new Error("No merchants found in response"); // fail test with clear message
      }
      const merchantId = response.body.data[0].id;
      console.log("Merchant ID found:", merchantId);
      return cy.wrap(response.body.data[0].id);
    });
});
