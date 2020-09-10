import { hasHeader } from '../helpers/header'
import { visitLoginPage } from '../helpers/login'

describe('login', () => {
  it('follows link to /login when clicking the login button', () => {
    cy.visit('/')

    visitLoginPage()
    cy.url().should('include', '/login')
  })

  it('has header', () => {
    cy.visit('/login')

    hasHeader()
  })
})

describe('login form', () => {
  it('contains fields for email, and password', () => {
    cy.visit('/login')

    cy.get('input[name="email"]').should('exist')
    cy.get('input[name="password"]').should('exist')
  })

  it('disables submit button when email and/or password are invalid inputs', () => {
    cy.visit('/login')

    cy.get('input[type="submit"]').as('submit').click({ force: true })

    cy.get('input[name="email"]').as('email').type('example')
    cy.get('@submit').click({ force: true })

    cy.get('input[name="password"]').as('password').type('pass')
    cy.get('@submit').click({ force: true })

    cy.get('@password').type('wo')
    cy.get('@submit').click({ force: true })

    cy.get('@email').type('@example')
    cy.get('@submit').click({ force: true })

    cy.get('@email').type('.com')
    cy.get('@submit').click()
  })
})