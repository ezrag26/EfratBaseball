import { hasHeader } from '../helpers/header'
import { visitLoginPage } from '../helpers/login'

describe('login', () => {
  it('follows link to /login when clicking the login button', () => {
    cy.visit('/')

    visitLoginPage()
    cy.url().should('include', '/login')
  })

  it('has header', () => {
    cy.visit('/')

    visitLoginPage()
    hasHeader()
  })
})

describe('login form', () => {
  it('contains fields for email, and password', () => {
    cy.visit('/')

    visitLoginPage()

    cy.get('input[name="email"]').should('exist')
    cy.get('input[name="password"]').should('exist')
  })
})