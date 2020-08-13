module.exports = {
  getLogo: () => {
    return cy.get('header img')
  },

  hasHeader: () => {
    cy.get('header').get('img').should('exist')
    cy.get('header').contains(/^login$/i).should('exist')
    cy.get('header').contains(/^register$/i).should('exist')
  }
}