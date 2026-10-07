describe('Submission page', () => {
  beforeEach(() => {
    cy.intercept('GET', `${Cypress.env('api_address')}/features`, { fixture: 'features.json' });
    cy.intercept('GET', `${Cypress.env('api_address')}/submissions/44/completed_features`, { fixture: 'completed_features.json' });
    cy.intercept('GET', `${Cypress.env('api_address')}/users/me`, { fixture: 'me.json' })
    cy.intercept('GET', `${Cypress.env('api_address')}/analysis?expand=characteristic&submission__id=44&characteristic__feature__id=4`, { fixture: 'analysis.json' });
    cy.intercept('GET', `${Cypress.env('api_address')}/shapes`, { fixture: 'shapes.json' });
    cy.intercept('GET', `${Cypress.env('api_address')}/characteristics?expand=feature&feature__id=4`, { fixture: 'characteristics.json' });
    cy.intercept('GET', `${Cypress.env('api_address')}/submissions/44`, { fixture: 'submission_44.json' });
    cy.setCookie('Authorization', 'fake-token');
  });

  it.skip('See List of Shape & Features', () => {
    cy.visit('/doctor/44');
    cy.get('[data-cy=feature-button]').should('have.length', 23);
    cy.get('button.Mui-selected').should('have.text', 'Hairline');
  });

  it.skip('Go to Feature page', () => {
    cy.visit('/doctor/44');
    cy.get('button.Mui-selected').should('have.text', 'Hairline');
    cy.get('button.Mui-selected').click();
    cy.wait(3000)
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/doctor/44/features/4');
    });
  });

  it.skip('Expanded if selected', () => {
    cy.visit('/doctor/44/features/4?label=Hairline');
    cy.contains('M-shaped').parent().should('have.class', 'Mui-expanded');
  });

  it.skip('Expands when clicked', () => {
    cy.visit('/doctor/44/features/4?label=Hairline');
    const button = cy.contains('Narrow').parent()
    button.should('not.have.class', 'Mui-expanded');
    button.click();
    button.should('have.class', 'Mui-expanded');
  });

  it.skip('Finish submit', () => {
    cy.intercept(`${Cypress.env('api_address')}/analysis/batch_create_update`, (request) => {
      request.reply(201, {})
    })
    cy.visit('/doctor/44/features/4?label=Hairline');
    const button = cy.contains('Narrow').parent()
    button.should('not.have.class', 'Mui-expanded');
    button.click();
    button.should('have.class', 'Mui-expanded');
    const buttonFinish = cy.contains('Finish');
    buttonFinish.click();
    cy.wait(4000)
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/doctor/44');
    });
  });
});
