export const login = (email: string, password: string) => {
  cy.visit("http://localhost:8081/login");
  cy.wait(200)

  cy.get('[data-testid="login-email"]')
    .should("be.visible")
    .type(email);

  cy.get('[data-testid="login-password"]')
    .should("be.visible")
    .type(password);

  cy.get('[data-testid="login-submit"]').click();

  cy.url().should("include", "/home");
};