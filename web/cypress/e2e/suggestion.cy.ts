describe('Production Suggestion', () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:3333/api/test/reset');
    cy.visit('http://localhost:5173/suggestion');
  });

  it('calculates suggestion and shows total value', () => {
    cy.contains('Calculate suggestion').click();

    cy.contains('Total value').should('be.visible');
    cy.contains('R$').should('be.visible');
    cy.contains('P002').should('be.visible'); // do seed
  });
});
