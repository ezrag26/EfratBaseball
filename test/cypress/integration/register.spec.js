import { hasHeader } from "./helpers/header";
import { visitRegisterPage } from './helpers/register'

describe('register', () => {
  it('follows link to /register when clicking the register button', () => {
    cy.visit('/')

    visitRegisterPage()
    cy.url().should('include', '/register')
  })

  it('has header', () => {
    cy.visit('/')

    visitRegisterPage()
    hasHeader()
  })
})

describe('register form', () => {
  it('contains fields for First Name, Last Name, email, phone number, and password', () => {
    cy.visit('/')

    visitRegisterPage()

    cy.get('input[name="first-name"]').should('exist')
    cy.get('input[name="last-name"]').should('exist')
    cy.get('input[name="email"]').should('exist')
    cy.get('input[name="phone"]').should('exist')
    cy.get('select').should('exist')
    cy.get('input[name="password"]').should('exist')
  })
})