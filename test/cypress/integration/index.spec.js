import { hasHeader, getLogo } from '../helpers/header'

describe('header', () => {
  it('has header', () => {
    cy.visit('/')
    hasHeader()
  })

  it.skip('follows link to homepage when clicking on logo', () => {
    cy.visit('/')
    getLogo().click()

    cy.url().should('eq', 'http://dev.efratbaseball.com/')
  })
})