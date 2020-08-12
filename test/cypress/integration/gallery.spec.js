describe('gallery', () => {
  it('displays pictures', () => {
    cy.visit('/gallery')
    cy.get('#root img').should('exist')
  })
})