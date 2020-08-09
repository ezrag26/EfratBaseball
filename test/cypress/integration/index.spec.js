describe('header', () => {
  it('displays Efrat Baseball on load', () => {
    cy.visit('/')
    cy.contains(/^Efrat Baseball$/i)
  })
})