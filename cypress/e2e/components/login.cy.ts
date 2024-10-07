describe('Login Page', () => {

  beforeEach(() => {
    // Visit the login page before each test
    cy.visit('/login');
  });

  it('should display the login form correctly', () => {
    // Check if the username and password fields are present
    cy.get('input#username').should('be.visible');
    cy.get('input#password').should('be.visible');
    
    // Check if the submit button is present
    cy.get('button[type="submit"]').should('contain.text', 'Submit');
  });

  it('should show an alert for invalid credentials', () => {
    // Enter an invalid username and password
    cy.get('input#username').type('invalid_user');
    cy.get('input#password').type('invalid_password');

    // Click the submit button
    cy.get('button[type="submit"]').click();

    // Check that the invalid login alert is shown
    cy.on('window:alert', (alertText) => {
      expect(alertText).to.equal('Invalid username or password');
    });
  });

  it('should successfully login with valid credentials', () => {
    // Enter a valid username and password
    cy.get('input#username').type('valid_user');
    cy.get('input#password').type('valid_password');

    // Click the submit button
    cy.get('button[type="submit"]').click();

    // Check that we are redirected to the profile page
    cy.url().should('include', '/profile');
  });

  it('should handle server error during login', () => {
    // Simulate a server error scenario
    cy.intercept('POST', '/api/login', {
      statusCode: 500,
      body: { error: 'Internal server error' }
    });

    // Enter valid credentials but trigger the error
    cy.get('input#username').type('valid_user');
    cy.get('input#password').type('valid_password');
    
    // Click the submit button
    cy.get('button[type="submit"]').click();

    // Check that the error alert is shown
    cy.on('window:alert', (alertText) => {
      expect(alertText).to.equal('An error occurred during login. Please try again.');
    });
  });

});
