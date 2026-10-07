describe('Submission list', () => {
  it.skip('Shows Submission list', () => {
    cy.intercept(
      'GET',
      `${Cypress.env('api_address')}/submissions?is_incomplete=true&page=1&page_size=10`,
      { fixture: 'submission_list.json' }
    );
    cy.setCookie('Authorization', 'fake-token');
    cy.visit('/doctor');
    cy.get('[data-cy=submission_card]').should('have.length', 29);
  });

  it.skip('when Submission list is empty', () => {
    cy.intercept(
      'GET',
      `${Cypress.env('api_address')}/submissions?is_incomplete=true&page=1&page_size=10`,
      { statusCode: 401, fixture: 'submission_list_empty.json' }
    );
    cy.setCookie('Authorization', 'fake-token');

    cy.visit('/doctor');

    cy.get('[data-cy=submission_card]').should('have.length', 0);
    cy.get('body').should('include.text', 'All done, lean back and smile!');
  });

  it.skip('go to submission details page', () => {
    cy.intercept(
      'GET',
      `${Cypress.env('api_address')}/submissions?is_incomplete=true&page=1&page_size=10`,
      { fixture: 'submission_list.json' }
    );
    cy.intercept('GET', `${Cypress.env('api_address')}/users/me`, { fixture: 'me.json' });
    cy.setCookie('Authorization', 'fake-token');

    cy.visit('/doctor');
    cy.get('[data-cy=submission_card]').first().click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/doctor/9');
    });
  });
});
