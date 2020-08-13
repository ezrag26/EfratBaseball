module.exports = {
  visitLoginPage: () => {
    cy.contains(/login/i).click()
  }
}