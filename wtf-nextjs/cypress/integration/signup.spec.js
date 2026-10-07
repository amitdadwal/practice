describe('SignUp', () => {
  it.skip('redirect to / after success', () => {

    cy.intercept('POST', `${Cypress.env('api_address')}/register`, { fixture: 'register.json' })
    cy.intercept('POST', `${Cypress.env('api_address')}/login`, { fixture: 'login.json' })
    cy.intercept('GET', `${Cypress.env('api_address')}/users/me`, { fixture: 'me.json' })

    cy.visit('/signup')
    cy.get('input[name="firstName"]').type('Masud')
    cy.get('input[name="lastName"]').type('Rana')
    cy.get('input[name="email"]').type('mr2@tsl.io')
    cy.get('input[name="phoneNumber"]').type('01680590357')
    cy.get('input[name="password"]').type('1234')
    cy.get('input[name="acceptConsent"]').click()
    cy.get('button[type="submit"]').click()
    cy.location().should(loc => {
      expect(loc.pathname).to.eq('/')
    })
  })
})