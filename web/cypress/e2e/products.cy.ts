describe('Products', () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:3333/api/test/reset');
    cy.visit('http://localhost:5173/products');
  });

  it('creates a new product and shows it in the table', () => {
    cy.contains('button', 'New product').click();

    cy.contains('h2', 'Create product').should('be.visible');

    cy.get('input#code').type('P100');
    cy.get('input#name').type('Test Product');
    cy.get('input#value').clear().type('55.5');

    cy.contains('button', 'Create').should('be.enabled').click();

    cy.contains('P100').should('be.visible');
    cy.contains('Test Product').should('be.visible');
    cy.get('.bg-black\\/40').should('not.exist');

  });
});
