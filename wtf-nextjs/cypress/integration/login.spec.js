describe('Login', () => {
  it.skip('redirect to / after success', () => {

    cy.intercept('POST', `${Cypress.env('api_address')}/login`, { fixture: 'login.json' })
    cy.intercept('GET', `${Cypress.env('api_address')}/users/me`, { fixture: 'me.json' })

    cy.visit('/')
    cy.get('input[name="password"]').type('1234-fake')
    cy.get('button[type="submit"]').click()
    cy.location().should(loc => {
      expect(loc.pathname).to.eq('/doctor')
    })
  })
})