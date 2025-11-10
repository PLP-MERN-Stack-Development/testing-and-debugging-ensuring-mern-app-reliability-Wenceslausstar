describe("Navigation and Routing", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should load the home page successfully", () => {
    cy.url().should("include", "/");
    cy.get("body").should("be.visible");
  });

  it("should handle 404 errors gracefully", () => {
    cy.visit("/nonexistent-page", { failOnStatusCode: false });
    cy.get("body").should("be.visible");
  });
});
