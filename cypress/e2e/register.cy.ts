describe('Register', () => {
  beforeEach(() => {
    cy.visit('/register'); // Open the registration page before each test
  });

  // Test for missing fields during registration
  it('should show an alert if required fields are missing', () => {
    // Input a first name and email only
    cy.get('input#firstName').type('John');
    cy.get('input#email').type('john.doe@example.com');
    // Submit the form
    cy.get('button[type="submit"]').click();

    // Check the alert message for missing fields
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Please fill in all required fields.');
    });
  });

  // Test invalid email format during registration
  it('should show an alert for an invalid email format', () => {
    // Input valid fields except for the email
    cy.get('input#firstName').type('John');
    cy.get('input#lastName').type('Doe');
    cy.get('input#username').type('john_doe'); // Existing username; consider changing to 'testUser' if conflicts arise
    cy.get('input#email').type('invalid-email'); // Invalid email format
    cy.get('input#dob').type('1990-01-01'); // Enter date of birth
    cy.get('input#password').type('valid_password');

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Check the alert message for invalid email
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Please enter a valid email address.');
    });
  });

  // Test successful registration with valid details
  it('should register successfully with valid inputs', () => {
    // Input valid registration details
    cy.get('input#firstName').type('John');
    cy.get('input#lastName').type('Doe');
    cy.get('input#username').type('testUser'); // Changed to 'testUser' to avoid conflict with existing 'john_doe'
    cy.get('input#email').type('testuser@example.com'); // Changed to a unique email
    cy.get('input#dob').type('1990-01-01'); // Enter date of birth
    cy.get('input#password').type('valid_password');

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Check the URL to confirm navigation to the profile page
    cy.url().should('include', '/profile');
  });

  // Test server error handling during registration
  it('should handle server errors during registration', () => {
    // Simulate a server error during registration
    cy.intercept('POST', '/api/signup', {
      statusCode: 500,
      body: { error: 'Internal server error' },
    });

    // Input valid registration details
    cy.get('input#firstName').type('John');
    cy.get('input#lastName').type('Doe');
    cy.get('input#username').type('john_doe'); // Existing username; consider changing to 'testUser' if conflicts arise
    cy.get('input#email').type('john.doe@example.com');
    cy.get('input#dob').type('1990-01-01');
    cy.get('input#password').type('valid_password');

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Check the alert message for server error
    cy.on('window:alert', (str) => {
      expect(str).to.equal(
        'An error occurred during signup. Please try again.'
      );
    });
  });
});
