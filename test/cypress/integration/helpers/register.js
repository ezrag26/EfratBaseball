module.exports = {
  visitRegisterPage: () => {
    cy.contains(/register/i).click()
  }
}