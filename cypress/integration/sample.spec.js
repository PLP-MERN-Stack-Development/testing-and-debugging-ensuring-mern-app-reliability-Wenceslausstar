describe('Sample E2E Test', () => {
  it('should visit the home page and see the welcome message', () => {
    cy.visit('/');
    cy.contains('Welcome');
  });
});
