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

  it("Add the recipe to favorites and shows in the home page", () => {

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

    cy.get('[data-testid="favorite-button"]')
      .click();

    cy.get('[data-testid="recipe-title"]')
      .invoke("text")
      .as("recipeTitle");

    cy.go("back");

    cy.url().should("include", "/home");

    
    cy.get('[data-testid="home-favorite"]').click();

    cy.get

    
  });

});


describe("Create Recipe Flow", () => {
  const baseUrl = "http://localhost:8081";

  beforeEach(() => {
    login("1@gmail.com", "starwars");
    cy.url().should("include", "/home"); 
    });

  it("should create a new recipe successfully", () => {

    cy.contains("Create Post").click();

    cy.url().should("include", "/recipes/create-recipe");
    cy.contains("Create Recipe").should("be.visible");

    cy.get('input[placeholder="Text"]').type("This is a test recipe");
    cy.get('input[placeholder="Title"]').type("Cypress Test Recipe");
    cy.get('input[placeholder="Author ID"]').type("1");
    cy.get('[data-testid="create-description"]').type("Delicious automated test recipe");
    cy.get('input[placeholder="Cuisine"]').type("Test Cuisine");
    cy.get('input[placeholder="Difficulty"]').type("Easy");
    cy.get('input[placeholder="Prep Time (minutes)"]').type("15");
    cy.get('input[placeholder="Calories"]').type("200");

    cy.get('input[placeholder="Name"]').first().type("Flour");
    cy.get('input[placeholder="Quantity"]').first().type("100g");
    cy.contains("+ Add Ingredient").click();
    cy.get('input[placeholder="Name"]').eq(1).type("Sugar");
    cy.get('input[placeholder="Quantity"]').eq(1).type("50g");

  
    cy.get('input[placeholder="Instruction 1"]').type("Mix ingredients");
    cy.get('input[placeholder="Media URL (optional)"]').type("https://example.com/image.jpg");
    cy.contains("+ Add Step").click();
    cy.get('input[placeholder="Instruction 2"]').type("Bake for 10 mins");

   
    cy.get('input[placeholder="Tag 1"]').type("Dessert");
    cy.contains("+ Add Tag").click();
    cy.get('input[placeholder="Tag 2"]').type("Test");

    cy.get('input[placeholder="Allergy 1"]').type("None");

    cy.contains("Post Recipe").click();


    cy.visit(`${baseUrl}/home`);
    cy.contains("Cypress Test Recipe").should("be.visible");
  });
  
  describe("Recipe Filtering", () => {
  const baseUrl = "http://localhost:8081";

  beforeEach(() => {
    login("1@gmail.com", "starwars");
    cy.url().should("include", "/home"); 

    });

  it("opens the filter modal, applies filters, and shows filtered recipes", () => {
    cy.contains("Filter").click();

    cy.contains("Filter Recipes").should("be.visible");

    cy.get('input[placeholder="Min Calories"]').type("100");
    cy.get('input[placeholder="Max Calories"]').type("500");
    cy.get('input[placeholder="Min Prep Time"]').type("10");
    cy.get('input[placeholder="Max Prep Time"]').type("60");
    cy.get('input[placeholder="Tags (comma separated)"]').type("Dessert, Test");
    cy.get('input[placeholder="Allergies (comma separated)"]').type("Nuts");
    cy.get('input[placeholder="Difficulty"]').type("Easy");
    cy.get('input[placeholder="Cuisine"]').type("Test Cuisine");

    cy.contains("Apply Filters").click();

    cy.contains("Filter Recipes").should("not.exist");

    cy.contains("Cypress Test Recipe").should("be.visible");

  });

  it("can cancel the filter modal without applying", () => {
    cy.contains("Filter").click();

    cy.contains("Filter Recipes").should("be.visible");

    cy.contains("Cancel").click();

    cy.contains("Filter Recipes").should("not.exist");
  });
});

});

