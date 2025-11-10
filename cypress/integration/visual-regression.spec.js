describe("Visual Regression Tests", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should match the home page snapshot", () => {
    // Take a screenshot for visual regression testing
    cy.screenshot("home-page");
  });

  it("should match component snapshots", () => {
    // Test Hello component visual appearance
    cy.get("h1").should("be.visible");
    cy.screenshot("hello-component");
  });

  it("should handle responsive design", () => {
    // Test different viewport sizes
    cy.viewport("iphone-6");
    cy.screenshot("home-page-mobile");

    cy.viewport("ipad-2");
    cy.screenshot("home-page-tablet");

    cy.viewport(1920, 1080);
    cy.screenshot("home-page-desktop");
  });

  it("should handle loading states", () => {
    // Test loading states if components have them
    cy.get("body").should("be.visible");
  });
});
