import { login } from "../support/login";

describe("Home screen flows", () => {

  beforeEach(() => {
    login("1@gmail.com", "starwars");
    cy.url().should("include", "/home"); 
  });




  it("Opens a recipe and shows details", () => {

    cy.get('[data-testid="recipe-item"]')
      .first()
      .should("be.visible")
      .click();

cy.url().should("match", /\/recipes\/[a-f0-9]{24}$/);
    cy.get('[data-testid="recipe-title"]')
      .should("be.visible")
      .and("not.be.empty");

    cy.get('[data-testid="recipe-description"]')
      .should("be.visible")
      .and("not.be.empty");
  });

});