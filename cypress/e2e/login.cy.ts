describe('Account', () => {
  beforeEach(() => {
    cy.visit('/login'); // open page http://localhost:4200/login
  });

  // Test invalid username or password
  it('invalid username or password', () => {
    // input a username and an invalid password
    cy.get('input').first().type('k.su@griffith.edu.au');
    cy.get('input').last().type('123');
    cy.get('button').click(); // click to submit

    cy.on('window:alert', (str) => {
      expect(str).to.equal('email or password incorrect'); // check the alert
    });
  });

  // Test valid username and password
  it('valid username and password', () => {
    // input a valid pair of a username and a password
    cy.get('input').first().type('k.su@griffith.edu.au');
    cy.get('input').last().type('666666');
    cy.get('button').click();

    cy.on('window:alert', (str) => {
      expect(str).to.equal('correct'); // check the alert
    });

    cy.url().should('include', '/account'); // check the current page URL

    // check the session storage
    cy.getAllSessionStorage().then((result) => {
      expect(result['http://localhost:4200']['username']).to.deep.equal(
        'k.su@griffith.edu.au'
      );
    });
  });
});
