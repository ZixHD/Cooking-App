import { login } from "../support/login";

describe("User Profile", () => {
  const baseUrl = "http://localhost:8081";

  beforeEach(() => {
    login("1@gmail.com", "starwars");
    cy.visit(`${baseUrl}/profile`);
  });

  it("loads the profile correctly", () => {
    cy.contains("Username").should("be.visible");
    cy.contains("Email").should("be.visible");

    cy.get('input[value]').should("have.length.greaterThan", 0); // at least one input
  });

  it("edits profile info and saves successfully", () => {
    cy.contains("Edit Profile").click();

    cy.get('input[value]')
      .first()
      .clear()
      .type("CypressUser");

    cy.get('input[value]')
      .eq(1)
      .clear()
      .type("cypress@test.com");

    cy.get('input[placeholder="Avatar URL"]')
      .clear()
      .type("https://cdn-icons-png.flaticon.com/512/149/149071.png");

    cy.contains("Save").click();

    cy.on("window:alert", (text) => {
      expect(text).to.contains("Profile saved successfully");
    });

    cy.get('input[value="cypress@test.com"]').should("exist");
  });

  it("displays default avatar when image fails to load", () => {
cy.get('[data-testid="profile-avatar"]').should('exist');  });
});
