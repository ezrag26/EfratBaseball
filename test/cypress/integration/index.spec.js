import { hasHeader, getLogo } from '../helpers/header'

describe('header', () => {
  it('has header', () => {
    cy.visit('/')
    hasHeader()
  })

  it('follows link to homepage when clicking on Efrat Baseball', () => {
    cy.visit('/')
    getLogo().click()

    cy.url().should('eq', 'http://localhost:8010/')
  })
})