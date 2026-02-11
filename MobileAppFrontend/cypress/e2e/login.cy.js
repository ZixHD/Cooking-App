describe("Login function", () => {

  const baseUrl = "http://localhost:8081";

  beforeEach(() => {
    cy.visit(`${baseUrl}/login`);
    cy.wait(200)
  });

  it("Logs in successfully and navigates to Recipe Home", () => {
    cy.get('[data-testid="login-email"]')
      .should('be.visible')
      .type('1@gmail.com');

    cy.get('[data-testid="login-password"]')
      .should('be.visible')
      .type('starwars');

    cy.get('[data-testid="login-submit"]').click();

    cy.url().should("include", "/home");
    cy.contains("Recipes").should("be.visible");
  });

  it("Shows error when no data is entered", () => {
    cy.get('[data-testid="login-submit"]').click();

    cy.on("window:alert", (text) => {
      expect(text).to.eq("All fields are required");
    });
  });

  it("Shows error when only email is entered", () => {
    cy.get('[data-testid="login-email"]').type('1@gmail.com');
    cy.get('[data-testid="login-submit"]').click();

    cy.on("window:alert", (text) => {
      expect(text).to.eq("All fields are required");
    });
  });

  it("Shows error for invalid email format", () => {
    cy.get('[data-testid="login-email"]').type('invalid-email');
    cy.get('[data-testid="login-password"]').type('starwars');
    cy.get('[data-testid="login-submit"]').click();

    cy.on("window:alert", (text) => {
      expect(text).to.eq("Invalid email");
    });
  });

});
