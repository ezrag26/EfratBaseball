describe.skip('admin site', () => {
  it('loads admin login page', () => {
    cy.visit('/admin')
      .url().should('include', '/admin')
  })
})